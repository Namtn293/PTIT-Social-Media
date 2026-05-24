import "./HomeContent.css";
import { useState, useEffect } from "react";
import statisticAdminApi from "../../api/StatisticAdminApi.js";

function SkeletonStatCard() {
  return (
    <div className="hc-stat-card" style={{ opacity: 0.6 }}>
      <div className="hc-stat-icon skeleton-shimmer" style={{ width: 56, height: 56, borderRadius: 12 }} />
      <div className="hc-stat-info" style={{ flex: 1 }}>
        <div className="skeleton-shimmer" style={{ width: "60%", height: 14, marginBottom: 8, borderRadius: 4 }} />
        <div className="skeleton-shimmer" style={{ width: "80%", height: 20, marginBottom: 8, borderRadius: 4 }} />
        <div className="skeleton-shimmer" style={{ width: "70%", height: 12, borderRadius: 4 }} />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div style={{ padding: "20px" }}>
      <div className="skeleton-shimmer" style={{ width: "30%", height: 20, marginBottom: 20, borderRadius: 4 }} />
      <svg width="100%" viewBox="0 0 520 200" style={{ opacity: 0.3 }}>
        <rect x="20" y="20" width="480" height="160" fill="none" stroke="#e8eaf0" strokeWidth="1" />
      </svg>
    </div>
  );
}

function SkeletonRecentPost() {
  return (
    <div className="hc-recent-item" style={{ opacity: 0.6 }}>
      <div className="hc-recent-info">
        <div className="skeleton-shimmer" style={{ width: "85%", height: 16, marginBottom: 10, borderRadius: 4 }} />
        <div className="skeleton-shimmer" style={{ width: "60%", height: 12, borderRadius: 4 }} />
      </div>
    </div>
  );
}

function LineChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 520;
  const H = 200;
  const PAD = { top: 20, right: 20, bottom: 30, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxPosts = Math.max(...data.map((d) => d.posts));

  const xStep = innerW / (data.length - 1);
  const scaleY = (val, max) => innerH - (val / (max * 1.15)) * innerH;

  const maxYValue = maxPosts + 1;
  const yTicksCount = Math.min(5, maxYValue);
  const tickStep = Math.ceil(maxYValue / yTicksCount);
  const yTicks = Array.from({ length: yTicksCount + 1 }, (_, i) => {
    const val = i * tickStep;
    return val <= maxYValue ? val : maxYValue;
  }).filter((v, i, arr) => i === 0 || v !== arr[i - 1]);

  const pathD = (key, max) => {
    return data
      .map((d, i) => {
        const x = PAD.left + i * xStep;
        const y = PAD.top + scaleY(d[key], maxYValue);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");
  };

  const areaD = (key, max) => {
    const pts = data.map((d, i) => ({
      x: PAD.left + i * xStep,
      y: PAD.top + scaleY(d[key], maxYValue),
    }));
    const firstX = pts[0].x;
    const lastX = pts[pts.length - 1].x;
    const bottom = PAD.top + innerH;
    return (
      `M ${firstX} ${bottom} ` +
      pts.map((p) => `L ${p.x} ${p.y}`).join(" ") +
      ` L ${lastX} ${bottom} Z`
    );
  };

  const showXLabel = (i) => {
    if (data.length <= 8) return true;
    return i % Math.ceil(data.length / 6) === 0 || i === data.length - 1;
  };

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="gradPosts" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick) => {
        const y = PAD.top + scaleY(tick, maxYValue);
        return (
          <g key={tick}>
            <line
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="#e8eaf0"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#9ca3af"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) =>
        showXLabel(i) ? (
          <text
            key={i}
            x={PAD.left + i * xStep}
            y={H - 4}
            textAnchor="middle"
            fontSize="10"
            fill="#9ca3af"
          >
            {d.date}
          </text>
        ) : null
      )}

      {/* Area fills */}
      <path d={areaD("posts", maxYValue)} fill="url(#gradPosts)" />

      {/* Lines */}
      <path
        d={pathD("posts", maxYValue)}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Dots + hover */}
      {data.map((d, i) => {
        const cx = PAD.left + i * xStep;
        const cyPosts = PAD.top + scaleY(d.posts, maxYValue);
        return (
          <g key={i}>
            <circle
              cx={cx}
              cy={cyPosts}
              r="4"
              fill="#6366f1"
              stroke="white"
              strokeWidth="2"
            />
            {/* Invisible wider hit area */}
            <rect
              x={cx - xStep / 2}
              y={PAD.top}
              width={xStep}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setTooltip({ i, x: cx, d })}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "crosshair" }}
            />
          </g>
        );
      })}

      {/* Tooltip */}
      {tooltip && (() => {
        const { x, d } = tooltip;
        const tx = x + 12 > W - 100 ? x - 115 : x + 12;
        return (
          <g>
            <rect
              x={tx}
              y={PAD.top}
              width="100"
              height="36"
              rx="6"
              fill="white"
              stroke="#e0e0e0"
              strokeWidth="1"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
            />
            <text x={tx + 8} y={PAD.top + 16} fontSize="10" fill="#374151" fontWeight="600">
              {d.date}
            </text>
            <text x={tx + 8} y={PAD.top + 30} fontSize="10" fill="#6366f1">
              ● Bài viết: {d.posts}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon, label, value, percentage, status, color }) {
  const isIncrease = status === "Increase";
  return (
    <div className="hc-stat-card">
      <div className="hc-stat-icon" style={{ background: color + "18" }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="hc-stat-info">
        <p className="hc-stat-label">{label}</p>
        <p className="hc-stat-value">{value}</p>
        <p className="hc-stat-growth">
          <span className="hc-arrow" style={{ color: isIncrease ? "#10b981" : "#ef4444" }}>
            {isIncrease ? "↑" : "↓"}
          </span>{" "}
          <span style={{ color: isIncrease ? "#10b981" : "#ef4444" }}>
            {percentage?.toFixed(2)}% {isIncrease ? "tăng" : "giảm"}
          </span>{" "}
          so với tháng trước
        </p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
function HomeContent() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Statistics state
  const [userStats, setUserStats] = useState(null);
  const [postStats, setPostStats] = useState(null);
  const [documentStats, setDocumentStats] = useState(null);
  const [notificationStats, setNotificationStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Recent Posts state
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentPostsLoading, setRecentPostsLoading] = useState(true);

  // Fetch chart data from API
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await statisticAdminApi.getAllAdminPost();
        console.log("API Response:", response.data); // Debug log
        // API trả về {data: [...], message: ..., status: ...}
        setChartData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError(err.message);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Fetch statistics data from APIs
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true);
        const [userRes, postRes, docRes, notifRes] = await Promise.all([
          statisticAdminApi.getUserStatistic(),
          statisticAdminApi.getPostStatistic(),
          statisticAdminApi.getDocumentStatistic(),
          statisticAdminApi.getNotificationStatistic(),
        ]);
        
        setUserStats(userRes.data.data);
        setPostStats(postRes.data.data);
        setDocumentStats(docRes.data.data);
        setNotificationStats(notifRes.data.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Fetch recent posts from API
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setRecentPostsLoading(true);
        const response = await statisticAdminApi.getTop4EarlyPost();
        console.log("Recent Posts API Response:", response.data);
        setRecentPosts(response.data.data || []);
      } catch (err) {
        console.error("Error fetching recent posts:", err);
        setRecentPosts([]);
      } finally {
        setRecentPostsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Use fetched data - remove fallback to avoid confusion
  const data = chartData && Array.isArray(chartData) ? chartData : [];

  const totalPosts = data?.reduce((s, d) => s + d.posts, 0) || 0;
  const totalViews = data?.reduce((s, d) => s + d.views, 0).toLocaleString("vi-VN") || 0;

  return (
    <div className="hc-root">
      {/* ── Welcome Banner ── */}
      <div className="hc-welcome">
        <div className="hc-welcome-text">
          <h1 className="hc-welcome-title">Xin chào, Admin!</h1>
          <p className="hc-welcome-sub">Chúc bạn một ngày làm việc hiệu quả.</p>
        </div>
        <div className="hc-welcome-illustration">
          <svg viewBox="0 0 160 120" width="160" height="120">
            {/* Monitor */}
            <rect x="20" y="20" width="90" height="65" rx="6" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2"/>
            <rect x="28" y="28" width="74" height="48" rx="3" fill="white"/>
            {/* Chart lines on monitor */}
            <polyline points="36,62 50,48 64,55 78,40 92,50 96,44" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="36,70 50,65 64,68 78,58 92,63 96,60" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Stand */}
            <rect x="58" y="85" width="14" height="10" rx="2" fill="#c4b5fd"/>
            <rect x="50" y="95" width="30" height="5" rx="3" fill="#a78bfa"/>
            {/* Pie chart */}
            <circle cx="130" cy="50" r="22" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2"/>
            <path d="M130 50 L130 28 A22 22 0 0 1 148 61 Z" fill="#8b5cf6"/>
            <path d="M130 50 L148 61 A22 22 0 0 1 112 61 Z" fill="#a78bfa"/>
            <path d="M130 50 L112 61 A22 22 0 0 1 130 28 Z" fill="#c4b5fd"/>
            {/* Floating dots */}
            <circle cx="15" cy="40" r="4" fill="#ddd6fe" opacity="0.8"/>
            <circle cx="150" cy="20" r="5" fill="#ede9fe" opacity="0.8"/>
            <circle cx="10" cy="90" r="3" fill="#c4b5fd" opacity="0.6"/>
          </svg>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="hc-stats-grid">
        {statsLoading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          <>
            <StatCard
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              label="Người dùng mới trong tháng"
              value={userStats?.count || "0"}
              percentage={userStats?.percentage || 0}
              status={userStats?.status || "Increase"}
              color="#6366f1"
            />
            <StatCard
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              label="Bài viết mới trong tháng"
              value={postStats?.count || "0"}
              percentage={postStats?.percentage || 0}
              status={postStats?.status || "Increase"}
              color="#10b981"
            />
            <StatCard
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              label="Tài liệu mới trong tháng"
              value={documentStats?.count || "0"}
              percentage={documentStats?.percentage || 0}
              status={documentStats?.status || "Increase"}
              color="#8b5cf6"
            />
            <StatCard
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              label="Thông báo đã gửi trong tháng"
              value={notificationStats?.count || "0"}
              percentage={notificationStats?.percentage || 0}
              status={notificationStats?.status || "Increase"}
              color="#f59e0b"
              width="400px"
            />
          </>
        )}
      </div>

      {/* ── Bottom Row ── */}
      <div className="hc-bottom-row">
        {/* Line Chart */}
        <div className="hc-chart-card">
          <div className="hc-chart-header">
            <h2 className="hc-chart-title">Thống kê bài viết</h2>
          </div>
          <div className="hc-chart-wrap">
            {loading ? (
              <SkeletonChart />
            ) : error ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                <p style={{ color: "#ef4444" }}>Lỗi tải dữ liệu: {error}</p>
              </div>
            ) : data && data.length > 0 ? (
              <LineChart data={data} />
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                <p>Không có dữ liệu</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="hc-recent-card">
          <div className="hc-recent-header">
            <h2 className="hc-recent-title">Bài viết mới nhất</h2>
            <a href="/bai-viet" className="hc-see-all">Xem tất cả</a>
          </div>
          <div className="hc-recent-list">
            {recentPostsLoading ? (
              <>
                <SkeletonRecentPost />
                <SkeletonRecentPost />
                <SkeletonRecentPost />
                <SkeletonRecentPost />
              </>
            ) : recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post, index) => (
                <div className="hc-recent-item" key={index}>
                  <div className="hc-recent-info">
                    <p className="hc-recent-post-title">{post.content}</p>
                    <p className="hc-recent-meta">
                      {post.fullName} <span className="hc-dot">•</span> {post.time} {post.timeUnit}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#9ca3af", padding: "20px" }}>Không có bài viết nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeContent;