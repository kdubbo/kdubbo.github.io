---
hide:
- navigation
- toc
---

<div class="mesh-landing">
  <div class="mesh-bg-elements">
    <div class="mesh-grid"></div>
  </div>

  <div class="mesh-hero">
    <h1 class="mesh-title">
      Dubbo
      <span class="mesh-gradient-text">云原生固有网格</span>
    </h1>
    <p class="mesh-description">
      不需要任何代理，仍然可以获得服务网格的所有价值。
    </p>

  </div>

  <div class="mesh-showcase">
    <div class="mesh-showcase-column">
      <div class="mesh-showcase-image">
        <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="auto">
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#3B82F6" flood-opacity="0.1"/>
            </filter>
          </defs>

          <!-- xDS Lines -->
          <path d="M 200 80 L 100 150" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />
          <path d="M 200 80 L 300 150" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />
          <rect x="135" y="105" width="30" height="16" rx="4" fill="#EFF6FF"/>
          <text x="150" y="117" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="#60A5FA" text-anchor="middle">xDS</text>
          <rect x="235" y="105" width="30" height="16" rx="4" fill="#EFF6FF"/>
          <text x="250" y="117" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="#60A5FA" text-anchor="middle">xDS</text>

          <!-- RPC Line -->
          <path d="M 120 180 L 280 180" fill="none" stroke="#60A5FA" stroke-width="2" />
          <polygon points="275,176 283,180 275,184" fill="#60A5FA"/>
          <polygon points="125,176 117,180 125,184" fill="#60A5FA"/>
          <rect x="180" y="170" width="40" height="20" rx="4" fill="#EFF6FF"/>
          <text x="200" y="184" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#2563EB" text-anchor="middle">RPCs</text>

          <!-- Dubbod Control Plane -->
          <g transform="translate(200, 50)">
            <rect x="-60" y="-20" width="120" height="40" rx="20" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <text y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#2563EB" text-anchor="middle">Dubbod</text>
          </g>

          <!-- Consumer -->
          <g transform="translate(100, 180)">
            <rect x="-50" y="-24" width="100" height="48" rx="8" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <text y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#1E3A8A" text-anchor="middle">Consumer</text>
          </g>

          <!-- Provider -->
          <g transform="translate(300, 180)">
            <rect x="-50" y="-24" width="100" height="48" rx="8" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <text y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#1E3A8A" text-anchor="middle">Provider</text>
          </g>
        </svg>
      </div>
      <div class="mesh-showcase-content">
        <h3 class="mesh-showcase-title">直连通信</h3>
        <p class="mesh-showcase-desc">服务间通过 gRPC 直接调用，xDS 负责配置下发，将调用延迟降至最低。</p>
      </div>
    </div>

    <div class="mesh-showcase-column">
      <div class="mesh-showcase-image">
        <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="auto">
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#3B82F6" flood-opacity="0.1"/>
            </filter>
          </defs>

          <!-- Lines -->
          <path d="M 120 58 L 170 95" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />
          <path d="M 280 58 L 230 95" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />
          <path d="M 120 178 L 170 145" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />
          <path d="M 280 178 L 230 145" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />

          <!-- Shield/Lock Background -->
          <circle cx="200" cy="120" r="42" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
          
          <!-- Central Lock -->
          <path d="M192 112 L192 104 C192 98 208 98 208 104 L208 112 Z" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
          <rect x="188" y="112" width="24" height="18" rx="4" fill="#3B82F6"/>
          <circle cx="200" cy="122" r="2.5" fill="#FFF"/>

          <!-- Identity -->
          <g transform="translate(100, 58)">
            <rect x="-45" y="-16" width="90" height="32" rx="16" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <text y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#1E3A8A" text-anchor="middle">Identity</text>
          </g>
          <!-- Policy -->
          <g transform="translate(300, 58)">
            <rect x="-45" y="-16" width="90" height="32" rx="16" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <text y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#1E3A8A" text-anchor="middle">Policy</text>
          </g>
          <!-- mTLS -->
          <g transform="translate(100, 178)">
            <rect x="-45" y="-16" width="90" height="32" rx="16" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <text y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#1E3A8A" text-anchor="middle">mTLS</text>
          </g>
          <!-- Audit -->
          <g transform="translate(300, 178)">
            <rect x="-45" y="-16" width="90" height="32" rx="16" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <text y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#1E3A8A" text-anchor="middle">Audit</text>
          </g>
        </svg>
      </div>
      <div class="mesh-showcase-content">
        <h3 class="mesh-showcase-title">安全</h3>
        <p class="mesh-showcase-desc">内置服务间安全能力，原生支持 mTLS 双向认证、鉴权与传输加密。</p>
      </div>
    </div>

    <div class="mesh-showcase-column">
      <div class="mesh-showcase-image">
        <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="auto">
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#3B82F6" flood-opacity="0.1"/>
            </filter>
          </defs>

          <!-- Connectors -->
          <path d="M 120 100 L 140 100" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />
          <path d="M 280 100 L 260 100" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />
          <path d="M 200 150 L 200 170" fill="none" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" />

          <!-- Central Dashboard (Metrics) -->
          <g transform="translate(200, 90)">
            <rect x="-60" y="-40" width="120" height="80" rx="8" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <path d="M-40 20 L-20 -10 L0 5 L20 -20 L40 0" fill="none" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="-20" cy="-10" r="3" fill="#3B82F6"/>
            <circle cx="20" cy="-20" r="3" fill="#3B82F6"/>
          </g>

          <!-- Logs -->
          <g transform="translate(80, 100)">
            <rect x="-40" y="-24" width="80" height="48" rx="8" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <rect x="-20" y="-10" width="30" height="4" rx="2" fill="#93C5FD"/>
            <rect x="-20" y="0" width="40" height="4" rx="2" fill="#DBEAFE"/>
            <rect x="-20" y="10" width="20" height="4" rx="2" fill="#DBEAFE"/>
            <text y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#1E3A8A" text-anchor="middle">Logs</text>
          </g>

          <!-- Traces -->
          <g transform="translate(320, 100)">
            <rect x="-40" y="-24" width="80" height="48" rx="8" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <circle cx="-15" cy="0" r="4" fill="#60A5FA"/>
            <circle cx="0" cy="-10" r="4" fill="#93C5FD"/>
            <circle cx="15" cy="10" r="4" fill="#93C5FD"/>
            <path d="M-15 0 L0 -10 M0 -10 L15 10" fill="none" stroke="#DBEAFE" stroke-width="1.5"/>
            <text y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#1E3A8A" text-anchor="middle">Traces</text>
          </g>

          <!-- Metrics Label -->
          <g transform="translate(200, 190)">
            <rect x="-40" y="-16" width="80" height="32" rx="16" fill="#FFF" stroke="#BFDBFE" stroke-width="1.5" filter="url(#shadow)"/>
            <text y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#1E3A8A" text-anchor="middle">Metrics</text>
          </g>
        </svg>
      </div>
      <div class="mesh-showcase-content">
        <h3 class="mesh-showcase-title">可观测性</h3>
        <p class="mesh-showcase-desc">开箱即用地集成指标（Metrics）、日志（Logs）与分布式链路追踪（Traces），实时监控微服务网格的运行状态，快速定位性能瓶颈。</p>
      </div>
    </div>
  </div>
</div>
