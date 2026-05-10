import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "./actions";
import { LogOut, ShoppingBag, TrendingUp, Users, Smartphone, Eye, BarChart2, MousePointerClick, Globe, TicketCheck } from "lucide-react";
import { adminDb } from "../../lib/firebase-admin";
import LiveVisitors from "./LiveVisitors";
import OrdersTable from "./OrdersTable";
import RevenueChart from "./RevenueChart";
import TicketsPanel from "./TicketsPanel";

export const metadata = { title: "Admin – atlasibo" };
export const revalidate = 0;

const PLAN_PRICES: Record<string, number> = {
  "1 Mois": 7,
  "3 Mois": 18,
  "6 Mois": 30,
  "12 Mois": 49,
};

interface Submission {
  id: string;
  createdAt: string;
  status: "pending" | "paid" | "cancelled";
  forfait?: string;
  prix?: string;
  nom?: string;
  whatsapp?: string;
  email?: string;
  appareil?: string;
  remarque?: string;
  note?: string;
}

interface Ticket {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface PageView {
  page: string;
  date: string;
}

async function fetchOrders(): Promise<Submission[]> {
  try {
    const snap = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    return snap.docs.map((doc) => {
      const d = doc.data();
      const ts = d.createdAt?.toDate?.();
      return {
        id: doc.id,
        createdAt: ts ? ts.toISOString() : new Date().toISOString(),
        status: d.status ?? "pending",
        forfait: d.forfait,
        prix: d.prix,
        nom: d.nom,
        whatsapp: d.whatsapp,
        email: d.email,
        appareil: d.appareil,
        remarque: d.remarque,
        note: d.note,
      };
    });
  } catch {
    return [];
  }
}

async function fetchTickets(): Promise<Ticket[]> {
  try {
    const snap = await adminDb
      .collection("tickets")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    return snap.docs.map((doc) => {
      const d = doc.data();
      const ts = d.createdAt?.toDate?.();
      return {
        id: doc.id,
        createdAt: ts ? ts.toISOString() : new Date().toISOString(),
        name: d.name ?? "",
        email: d.email ?? "",
        subject: d.subject ?? "",
        message: d.message ?? "",
      };
    });
  } catch {
    return [];
  }
}

async function fetchPageViews(): Promise<PageView[]> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const snap = await adminDb
      .collection("pageViews")
      .where("timestamp", ">=", thirtyDaysAgo)
      .limit(2000)
      .get();
    return snap.docs.map((doc) => {
      const d = doc.data();
      return { page: d.page ?? "/", date: d.date ?? "" };
    });
  } catch {
    return [];
  }
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function shortDay(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(new Date(dateStr + "T12:00:00"));
  } catch {
    return dateStr.slice(5);
  }
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Accueil",
  "/commander": "Commander",
  "/commander/merci": "Merci (confirmation)",
  "/cgv": "CGV",
  "/confidentialite": "Confidentialité",
  "/mentions-legales": "Mentions légales",
};

function getPlanKey(forfait?: string): string {
  if (!forfait) return "Inconnu";
  if (forfait.includes("12")) return "12 Mois";
  if (forfait.includes("6")) return "6 Mois";
  if (forfait.includes("3")) return "3 Mois";
  if (forfait.includes("1")) return "1 Mois";
  return forfait;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminPage() {
  // Double-check auth server-side
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_SESSION_TOKEN) {
    redirect("/admin/login");
  }

  const [orders, pageViews, tickets] = await Promise.all([fetchOrders(), fetchPageViews(), fetchTickets()]);

  // ── Order Stats ──
  const totalOrders = orders.length;
  const planCounts: Record<string, number> = {};
  let estimatedRevenue = 0;
  const deviceCounts: Record<string, number> = {};

  for (const o of orders) {
    const plan = getPlanKey(o.forfait);
    planCounts[plan] = (planCounts[plan] ?? 0) + 1;
    if (o.status === "paid") estimatedRevenue += PLAN_PRICES[plan] ?? 0;
    const dev = o.appareil?.split("(")[0]?.trim() ?? "Autre";
    deviceCounts[dev] = (deviceCounts[dev] ?? 0) + 1;
  }
  const paidCount = orders.filter((o) => o.status === "paid").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const topPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0];
  const topDevice = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0];

  // ── Weekly Revenue (last 8 weeks) ──
  const weeklyRevenue = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (7 * (7 - i)));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const label = `S${i + 1}`;
    const revenue = orders
      .filter((o) => {
        if (o.status !== "paid") return false;
        const d = new Date(o.createdAt);
        return d >= weekStart && d < weekEnd;
      })
      .reduce((sum, o) => sum + (PLAN_PRICES[getPlanKey(o.forfait)] ?? 0), 0);
    return { label, revenue };
  });

  // ── Analytics Stats ──
  const today = new Date().toISOString().split("T")[0];
  const todayViews = pageViews.filter((v) => v.date === today).length;
  const totalViews = pageViews.length;

  const last7 = getLast7Days();
  const viewsByDay = last7.map((date) => ({
    date,
    label: shortDay(date),
    count: pageViews.filter((v) => v.date === date).length,
  }));
  const maxDay = Math.max(...viewsByDay.map((d) => d.count), 1);

  const pageCounts: Record<string, number> = {};
  for (const v of pageViews) {
    pageCounts[v.page] = (pageCounts[v.page] ?? 0) + 1;
  }
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const homeViews = pageCounts["/"] ?? 0;
  const orderViews = pageCounts["/commander/merci"] ?? 0;
  const conversionRate = homeViews > 0 ? ((orderViews / homeViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="admin-brand">atlasibo</span>
          <span className="admin-brand-tag">admin</span>
        </div>
        <nav className="admin-nav">
          <a href="/admin" className="admin-nav-item active">
            <ShoppingBag size={18} />
            Commandes
          </a>
          <a href="/admin#analytics" className="admin-nav-item">
            <BarChart2 size={18} />
            Analytiques
          </a>
          <a href="/admin#tickets" className="admin-nav-item">
            <TicketCheck size={18} />
            Tickets {tickets.length > 0 && <span className="admin-nav-badge">{tickets.length}</span>}
          </a>
        </nav>
        <form action={logoutAction} className="admin-sidebar-footer">
          <button type="submit" className="admin-logout-btn">
            <LogOut size={16} />
            Déconnexion
          </button>
        </form>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-page-title">Tableau de bord</h1>
            <p className="admin-page-sub">Bienvenue dans votre espace admin atlasibo</p>
          </div>
          <a href="/" className="admin-visit-btn" target="_blank" rel="noopener noreferrer">
            Voir le site ↗
          </a>
        </div>

        {/* ── Order KPIs ── */}
        <div className="admin-section-label">Commandes</div>
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon orders"><ShoppingBag size={22} /></div>
            <div>
              <p className="admin-kpi-label">Total commandes</p>
              <p className="admin-kpi-value">{totalOrders}</p>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon revenue"><TrendingUp size={22} /></div>
            <div>
              <p className="admin-kpi-label">Revenu confirmé</p>
              <p className="admin-kpi-value">{estimatedRevenue} €</p>
              <p className="admin-kpi-sub">{paidCount} payé · {pendingCount} attente · {cancelledCount} annulé</p>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon plan"><Users size={22} /></div>
            <div>
              <p className="admin-kpi-label">Forfait populaire</p>
              <p className="admin-kpi-value">{topPlan ? topPlan[0] : "—"}</p>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon device"><Smartphone size={22} /></div>
            <div>
              <p className="admin-kpi-label">Appareil principal</p>
              <p className="admin-kpi-value admin-kpi-value--sm">{topDevice ? topDevice[0] : "—"}</p>
            </div>
          </div>
        </div>

        {/* ── Analytics KPIs ── */}
        <div className="admin-section-label" id="analytics">Analytiques visiteurs</div>
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon analytics-today"><Eye size={22} /></div>
            <div>
              <p className="admin-kpi-label">Visites aujourd&apos;hui</p>
              <p className="admin-kpi-value">{todayViews}</p>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon analytics-total"><Globe size={22} /></div>
            <div>
              <p className="admin-kpi-label">Vues (30 jours)</p>
              <p className="admin-kpi-value">{totalViews}</p>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon analytics-conv"><MousePointerClick size={22} /></div>
            <div>
              <p className="admin-kpi-label">Taux de conversion</p>
              <p className="admin-kpi-value">{conversionRate}%</p>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon analytics-orders"><BarChart2 size={22} /></div>
            <div>
              <p className="admin-kpi-label">Confirmations reçues</p>
              <p className="admin-kpi-value">{orderViews}</p>
            </div>
          </div>
        </div>

        {/* ── Live visitors ── */}
        <LiveVisitors />

        {/* ── 7-day bar chart ── */}
        <div className="admin-card admin-card--full">
          <h2 className="admin-card-title">Visites — 7 derniers jours</h2>
          {totalViews === 0 ? (
            <p className="admin-empty">Les visites apparaîtront ici dès que des visiteurs arrivent sur le site.</p>
          ) : (
            <div className="admin-chart">
              {viewsByDay.map((d) => (
                <div key={d.date} className="admin-chart-col">
                  <span className="admin-chart-count">{d.count > 0 ? d.count : ""}</span>
                  <div className="admin-chart-bar-track">
                    <div
                      className="admin-chart-bar-fill"
                      style={{ height: `${Math.round((d.count / maxDay) * 100)}%` }}
                    />
                  </div>
                  <span className="admin-chart-label">{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Forfaits + Pages ── */}
        <div className="admin-row">
          <div className="admin-card">
            <h2 className="admin-card-title">Répartition des forfaits</h2>
            {totalOrders === 0 ? (
              <p className="admin-empty">Aucune donnée</p>
            ) : (
              <div className="admin-plan-bars">
                {Object.entries(planCounts).sort((a, b) => b[1] - a[1]).map(([plan, count]) => (
                  <div key={plan} className="admin-plan-bar-row">
                    <span className="admin-plan-bar-label">{plan}</span>
                    <div className="admin-plan-bar-track">
                      <div className="admin-plan-bar-fill" style={{ width: `${Math.round((count / totalOrders) * 100)}%` }} />
                    </div>
                    <span className="admin-plan-bar-count">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">Pages les plus visitées</h2>
            {topPages.length === 0 ? (
              <p className="admin-empty">Aucune donnée</p>
            ) : (
              <div className="admin-plan-bars">
                {topPages.map(([page, count]) => (
                  <div key={page} className="admin-plan-bar-row">
                    <span className="admin-plan-bar-label">{PAGE_LABELS[page] ?? page}</span>
                    <div className="admin-plan-bar-track">
                      <div className="admin-plan-bar-fill admin-plan-bar-fill--blue" style={{ width: `${Math.round((count / (topPages[0]?.[1] ?? 1)) * 100)}%` }} />
                    </div>
                    <span className="admin-plan-bar-count">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Devices ── */}
        <div className="admin-card admin-card--full">
          <h2 className="admin-card-title">Appareils utilisés (commandes)</h2>
          {totalOrders === 0 ? (
            <p className="admin-empty">Aucune donnée</p>
          ) : (
            <div className="admin-plan-bars">
              {Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]).map(([dev, count]) => (
                <div key={dev} className="admin-plan-bar-row">
                  <span className="admin-plan-bar-label">{dev}</span>
                  <div className="admin-plan-bar-track">
                    <div className="admin-plan-bar-fill" style={{ width: `${Math.round((count / totalOrders) * 100)}%` }} />
                  </div>
                  <span className="admin-plan-bar-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Orders table (searchable, filterable, exportable, with notes) ── */}
        <OrdersTable orders={orders} />

        {/* ── Revenue chart ── */}
        <div className="admin-section-label">Revenus</div>
        <RevenueChart weeklyData={weeklyRevenue} totalRevenue={estimatedRevenue} />

        {/* ── Support Tickets ── */}
        <div className="admin-section-label" id="tickets">Tickets support</div>
        <TicketsPanel tickets={tickets} />
      </main>
    </div>
  );
}
