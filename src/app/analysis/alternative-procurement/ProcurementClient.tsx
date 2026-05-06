'use client';

import React, { useState } from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';
import { Globe, ArrowRightLeft, Info, Droplet } from 'lucide-react';

interface SankeyNode {
  name: string;
  depth?: number;
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
  payload?: any;
  value?: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface ProcurementData {
  last_updated: string;
  unit: string;
  data: {
    nodes: SankeyNode[];
    links: SankeyLink[];
  };
}

// カスタムノードの描画（色やデザインの調整）
const CustomNode = (props: any) => {
  const { x, y, width, height, index, payload, value } = props;
  const isSource = payload.depth === 0;
  
  // 産出国と消費国で色を分ける
  const fillColors = [
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#10b981', // emerald
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#ef4444', // red
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
    '#14b8a6', // teal
  ];
  
  const color = fillColors[index % fillColors.length];

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity="0.8"
        stroke={color}
        strokeWidth={2}
        radius={[2, 2, 2, 2]}
      />
      <text
        x={isSource ? x + width + 6 : x - 6}
        y={y + height / 2}
        textAnchor={isSource ? 'start' : 'end'}
        dominantBaseline="middle"
        fill="var(--text-primary)"
        fontSize="12"
        fontWeight="bold"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
      >
        {payload.name}
      </text>
      <text
        x={isSource ? x + width + 6 : x - 6}
        y={y + height / 2 + 14}
        textAnchor={isSource ? 'start' : 'end'}
        dominantBaseline="middle"
        fill="var(--text-muted)"
        fontSize="10"
      >
        {value}
      </text>
    </Layer>
  );
};

// カスタムリンク（線の色）
const CustomLink = (props: any) => {
  const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index } = props;
  
  return (
    <Layer key={`CustomLink${index}`}>
      <path
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        stroke="var(--accent-blue)"
        strokeWidth={Math.max(1, linkWidth)}
        fill="none"
        strokeOpacity={0.2}
      />
      <path
        className="link-hover"
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        stroke="var(--accent-blue)"
        strokeWidth={Math.max(1, linkWidth)}
        fill="none"
        strokeOpacity={0}
        onMouseEnter={(e: any) => {
          e.target.setAttribute('stroke-opacity', '0.6');
          e.target.setAttribute('stroke', 'var(--risk-critical)');
        }}
        onMouseLeave={(e: any) => {
          e.target.setAttribute('stroke-opacity', '0');
          e.target.setAttribute('stroke', 'var(--accent-blue)');
        }}
      />
    </Layer>
  );
};

// ツールチップ
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.source && data.target) {
      // リンクの場合
      return (
        <div style={{
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          borderColor: 'var(--border-color)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          padding: '10px 15px',
          color: '#fff'
        }}>
          <p className="text-sm font-bold mb-1">
            {data.source.name} <ArrowRightLeft className="inline w-3 h-3 mx-1" /> {data.target.name}
          </p>
          <p className="text-xs text-accent-blue font-mono">
            {data.value} MBOED
          </p>
        </div>
      );
    } else {
      // ノードの場合
      return (
        <div style={{
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          borderColor: 'var(--border-color)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          padding: '10px 15px',
          color: '#fff'
        }}>
          <p className="text-sm font-bold mb-1">{data.name}</p>
          <p className="text-xs text-accent-blue font-mono">
            Total Flow: {data.value} MBOED
          </p>
        </div>
      );
    }
  }
  return null;
};

export default function ProcurementClient({ data }: { data: ProcurementData }) {
  if (!data || !data.data || !data.data.nodes.length) return null;

  return (
    <div className="fade-in">
      <section className="hero-section">
        <h1 className="hero-title">世界各国の石油代替調達ルート</h1>
        <p className="hero-subtitle">
          地政学リスク（制裁、紛争）に伴う、エネルギー資源の供給元から消費国へのサプライチェーンのシフトを可視化します。
        </p>
      </section>

      <div className="risk-stats mb-8">
          <div className="risk-stat-card">
              <div className="flex items-center justify-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-accent-blue" />
                  <span className="risk-stat-label">産出国シフト</span>
              </div>
              <div className="text-sm font-medium text-center mt-2">
                  ロシア産原油の禁輸により、<br/>中東・米国からの調達が急増
              </div>
          </div>
          <div className="risk-stat-card">
              <div className="flex items-center justify-center gap-2 mb-2">
                  <Droplet className="w-5 h-5 text-emerald-400" />
                  <span className="risk-stat-label">代替エネルギー</span>
              </div>
              <div className="text-sm font-medium text-center mt-2">
                  欧州を中心に、LNG・再生可能<br/>エネルギーへのシフトが加速
              </div>
          </div>
          <div className="risk-stat-card">
              <div className="flex items-center justify-center gap-2 mb-2 text-gray-400">
                  <Info className="w-5 h-5" />
                  <span className="risk-stat-label">データソース</span>
              </div>
              <div className="text-sm text-secondary font-medium text-center mt-2">
                  AI予測・推計データ
              </div>
              <div className="text-[10px] text-muted text-center mt-1">
                  最終更新: {new Date(data.last_updated).toLocaleDateString()}
              </div>
          </div>
      </div>

      <div className="glass-card mb-12 overflow-hidden" style={{ minHeight: '600px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title mb-0">
            <span className="icon">🔄</span>
            エネルギー・サプライチェーン (Sankey Diagram)
          </h2>
          <span className="text-xs text-muted font-mono">{data.unit}</span>
        </div>
        
        <div style={{ width: '100%', height: '500px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '20px 0' }}>
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={data.data}
              node={{ stroke: 'none' } as any}
              nodePadding={40}
              margin={{ left: 20, right: 120, top: 20, bottom: 20 }}
              link={<CustomLink />}
              nodeProps={<CustomNode />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Sankey>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass-card">
            <h3 className="section-title text-lg">💡 分析のポイント</h3>
            <ul className="article-summary flex flex-col gap-3">
                <li className="flex gap-2">
                    <span className="text-accent-blue font-bold">•</span>
                    <span><strong>対ロシア制裁の影響:</strong> 欧州のロシア依存度が激減する一方、中国・インドへの「安価なロシア産原油」のフローが拡大し、市場が分断されています。</span>
                </li>
                <li className="flex gap-2">
                    <span className="text-accent-blue font-bold">•</span>
                    <span><strong>米国の輸出プレゼンス拡大:</strong> 欧州のエネルギー危機を補うため、米国のLNG・原油輸出が戦略的に増加しています。</span>
                </li>
                <li className="flex gap-2">
                    <span className="text-accent-blue font-bold">•</span>
                    <span><strong>再生可能エネルギーへの構造的転換:</strong> 調達リスクを根本的に減らすため、各国で代替エネルギーの導入率が上昇傾向にあります。</span>
                </li>
            </ul>
        </div>
        <div className="glass-card">
            <h3 className="section-title text-lg">📊 データについて</h3>
            <p className="article-summary text-sm leading-relaxed text-muted">
                この関係図（サンキーダイアグラム）は、主要な産出地域から消費地域へのエネルギーフローを可視化したものです。線の太さは、資源の流れる量（依存度）を示しています。
                左側が供給元（Source）、右側が需要先（Target）となります。
            </p>
            <div className="mt-4 p-3 bg-black/30 rounded-lg text-[11px] text-muted font-mono">
                UNIT: {data.unit}<br />
                NOTE: This is a simplified estimated model for geopolitical analysis.
            </div>
        </div>
      </div>

    </div>
  );
}
