/* Maintenance-mode indicator.
 *
 * This file ships with every deploy, but the <script> tag that loads it is
 * injected into the pages ONLY when the deploy workflow runs with the
 * "maintenance" input ticked. So if this runs at all, maintenance is on.
 *
 * Only someone on the allowlisted IP ever sees it: everyone else is stopped
 * by the 503 rule in .htaccess and never loads these pages at all. Its job is
 * to make sure the one person who CAN still browse the site cannot forget
 * that the public is looking at the maintenance page.
 *
 * Anchored to the bottom because .site-header is position:fixed at the top -
 * a banner up there would fight it.
 */
(function () {
  'use strict';

  if (window.__pgMaintenanceBanner) return;   // never double-mount
  window.__pgMaintenanceBanner = true;

  function mount() {
    if (document.getElementById('pg-maintenance-banner')) return;

    var bar = document.createElement('div');
    bar.id = 'pg-maintenance-banner';
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');

    var style = document.createElement('style');
    style.textContent = [
      '#pg-maintenance-banner{',
      'position:fixed;left:0;right:0;bottom:0;z-index:2147483000;',
      'display:flex;align-items:center;justify-content:center;gap:10px;',
      'flex-wrap:wrap;padding:10px 16px;',
      'background:#b45309;color:#fff;',
      "font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;",
      'font-size:14px;line-height:1.45;text-align:center;',
      'box-shadow:0 -4px 18px rgba(0,0,0,.35);',
      'border-top:2px solid #f59e0b;}',
      '#pg-maintenance-banner strong{font-weight:700;letter-spacing:.06em;}',
      '#pg-maintenance-banner a{color:#fff;font-weight:600;text-decoration:underline;}',
      '#pg-maintenance-banner .pg-dot{',
      'width:9px;height:9px;border-radius:50%;background:#fde68a;',
      'box-shadow:0 0 0 0 rgba(253,230,138,.85);',
      'animation:pg-pulse 2s infinite;flex:0 0 auto;}',
      '@keyframes pg-pulse{',
      '0%{box-shadow:0 0 0 0 rgba(253,230,138,.85)}',
      '70%{box-shadow:0 0 0 9px rgba(253,230,138,0)}',
      '100%{box-shadow:0 0 0 0 rgba(253,230,138,0)}}',
      '@media (prefers-reduced-motion: reduce){',
      '#pg-maintenance-banner .pg-dot{animation:none}}',
      '@media (max-width:560px){#pg-maintenance-banner{font-size:13px;padding:9px 12px}}'
    ].join('');

    var dot = document.createElement('span');
    dot.className = 'pg-dot';

    var label = document.createElement('strong');
    label.textContent = 'MAINTENANCE MODE IS ON';

    var detail = document.createElement('span');
    detail.textContent =
      '— visitors are seeing the maintenance page. You can still browse because your IP is allowlisted.';

    var preview = document.createElement('a');
    preview.href = '/maintenance.html';
    preview.textContent = 'View what they see';

    bar.appendChild(style);
    bar.appendChild(dot);
    bar.appendChild(label);
    bar.appendChild(detail);
    bar.appendChild(preview);
    document.body.appendChild(bar);

    /* Keep the bar from covering the footer's last line, and lift the
       back-to-top button clear of it. */
    var pad = document.createElement('style');
    pad.textContent =
      'body{padding-bottom:64px!important}' +
      '.back-to-top{bottom:84px!important}';
    document.head.appendChild(pad);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
