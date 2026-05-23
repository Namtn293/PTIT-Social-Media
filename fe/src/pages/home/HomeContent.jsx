import "./HomeContent.css";
import { useState } from "react";

// ── Mock data ──────────────────────────────────────────────
const CHART_DATA = {
  "7 ngày qua": [
    { date: "17/05", posts: 45, views: 520 },
    { date: "18/05", posts: 60, views: 680 },
    { date: "19/05", posts: 38, views: 410 },
    { date: "20/05", posts: 75, views: 820 },
    { date: "21/05", posts: 55, views: 610 },
    { date: "22/05", posts: 48, views: 540 },
    { date: "23/05", posts: 52, views: 590 },
  ],
  "30 ngày qua": [
    { date: "01/05", posts: 35, views: 420 },
    { date: "02/05", posts: 42, views: 480 },
    { date: "03/05", posts: 50, views: 560 },
    { date: "04/05", posts: 45, views: 510 },
    { date: "05/05", posts: 38, views: 440 },
    { date: "06/05", posts: 55, views: 620 },
    { date: "07/05", posts: 48, views: 540 },
    { date: "08/05", posts: 62, views: 700 },
    { date: "09/05", posts: 40, views: 460 },
    { date: "10/05", posts: 35, views: 400 },
    { date: "11/05", posts: 58, views: 650 },
    { date: "12/05", posts: 45, views: 510 },
    { date: "13/05", posts: 52, views: 590 },
    { date: "14/05", posts: 48, views: 540 },
    { date: "15/05", posts: 65, views: 740 },
    { date: "16/05", posts: 72, views: 820 },
    { date: "17/05", posts: 58, views: 660 },
    { date: "18/05", posts: 45, views: 510 },
    { date: "19/05", posts: 38, views: 430 },
    { date: "20/05", posts: 55, views: 620 },
    { date: "21/05", posts: 60, views: 680 },
    { date: "22/05", posts: 42, views: 480 },
    { date: "23/05", posts: 50, views: 560 },
    { date: "24/05", posts: 45, views: 510 },
    { date: "25/05", posts: 38, views: 430 },
    { date: "26/05", posts: 52, views: 590 },
    { date: "27/05", posts: 48, views: 540 },
    { date: "28/05", posts: 55, views: 620 },
    { date: "29/05", posts: 50, views: 570 },
    { date: "30/05", posts: 45, views: 510 },
  ],
  "90 ngày qua": [
    { date: "01/03", posts: 28, views: 320 },
    { date: "15/03", posts: 35, views: 400 },
    { date: "01/04", posts: 42, views: 480 },
    { date: "15/04", posts: 55, views: 620 },
    { date: "01/05", posts: 48, views: 540 },
    { date: "15/05", posts: 65, views: 740 },
    { date: "30/05", posts: 50, views: 570 },
  ],
};

const RECENT_POSTS = [
  {
    id: 1,
    title: "Kinh nghiệm ôn thi giữa kỳ hiệu quả",
    author: "Nguyễn Văn A",
    time: "2 giờ trước",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=80&h=56&fit=crop",
  },
  {
    id: 2,
    title: "Tài liệu học tập môn Cấu trúc dữ liệu",
    author: "Trần Thị B",
    time: "5 giờ trước",
    img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=80&h=56&fit=crop",
  },
  {
    id: 3,
    title: "Hướng dẫn tạo CV xin việc chuyên nghiệp",
    author: "Lê Văn C",
    time: "1 ngày trước",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=80&h=56&fit=crop",
  },
  {
    id: 4,
    title: "Thảo luận: Nên học thêm ngôn ngữ nào?",
    author: "Phạm Thị D",
    time: "2 ngày trước",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=80&h=56&fit=crop",
  },
];

// ── SVG Line Chart ─────────────────────────────────────────
function LineChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 520;
  const H = 200;
  const PAD = { top: 20, right: 20, bottom: 30, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxPosts = Math.max(...data.map((d) => d.posts));
  const maxViews = Math.max(...data.map((d) => d.views));

  const xStep = innerW / (data.length - 1);
  const scaleY = (val, max) => innerH - (val / (max * 1.15)) * innerH;

  const polyPoints = (key, max) =>
    data
      .map((d, i) => `${PAD.left + i * xStep},${PAD.top + scaleY(d[key], max)}`)
      .join(" ");

  const pathD = (key, max) => {
    return data
      .map((d, i) => {
        const x = PAD.left + i * xStep;
        const y = PAD.top + scaleY(d[key], max);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");
  };

  const areaD = (key, max) => {
    const pts = data.map((d, i) => ({
      x: PAD.left + i * xStep,
      y: PAD.top + scaleY(d[key], max),
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

  // Y-axis ticks
  const yTicks = [0, 20, 40, 60, 80, 100];

  // Show only some x-axis labels to avoid clutter
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
        const y = PAD.top + scaleY(tick, 100);
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
      <path d={areaD("posts", maxPosts)} fill="url(#gradPosts)" />
      <path d={areaD("views", maxViews)} fill="url(#gradViews)" />

      {/* Lines */}
      <path
        d={pathD("posts", maxPosts)}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={pathD("views", maxViews)}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="5,3"
      />

      {/* Dots + hover */}
      {data.map((d, i) => {
        const cx = PAD.left + i * xStep;
        const cyPosts = PAD.top + scaleY(d.posts, maxPosts);
        const cyViews = PAD.top + scaleY(d.views, maxViews);
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
            <circle
              cx={cx}
              cy={cyViews}
              r="3.5"
              fill="#a78bfa"
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
              height="52"
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
function StatCard({ icon, label, value, growth, color }) {
  return (
    <div className="hc-stat-card">
      <div className="hc-stat-icon" style={{ background: color + "18" }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="hc-stat-info">
        <p className="hc-stat-label">{label}</p>
        <p className="hc-stat-value">{value}</p>
        <p className="hc-stat-growth">
          <span className="hc-arrow">↑</span> {growth} so với tháng trước
        </p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
function HomeContent() {
  const [period, setPeriod] = useState("30 ngày qua");
  const data = CHART_DATA[period];

  const totalPosts = data.reduce((s, d) => s + d.posts, 0);
  const totalViews = data.reduce((s, d) => s + d.views, 0).toLocaleString("vi-VN");

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
          value="1.248"
          growth="12.5%"
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
          value="342"
          growth="8.3%"
          color="#10b981"
        />
        <StatCard
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          label="Tài liệu mới trong tháng"
          value="28"
          growth="7.7%"
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
          value="156"
          growth="15.2%"
          color="#f59e0b"
          width="400px"
        />
      </div>

      {/* ── Bottom Row ── */}
      <div className="hc-bottom-row">
        {/* Line Chart */}
        <div className="hc-chart-card">
          <div className="hc-chart-header">
            <h2 className="hc-chart-title">Thống kê bài viết</h2>
          </div>
          <div className="hc-chart-wrap">
            <LineChart data={data} />
          </div>
        </div>

        {/* Recent Posts */}
        <div className="hc-recent-card">
          <div className="hc-recent-header">
            <h2 className="hc-recent-title">Bài viết mới nhất</h2>
            <a href="/bai-viet" className="hc-see-all">Xem tất cả</a>
          </div>
          <div className="hc-recent-list">
            {RECENT_POSTS.map((post) => (
              <div className="hc-recent-item" key={post.id}>
                <div className="hc-recent-info">
                  <p className="hc-recent-post-title">{post.title}</p>
                  <p className="hc-recent-meta">
                    {post.author} <span className="hc-dot">•</span> {post.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeContent;