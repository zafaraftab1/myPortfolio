/* ===================================================================
   Interactive System Design Viewer
   Vanilla JS — SVG-based architecture diagram renderer
   Cyber / Pitch-Black + Gold theme
   =================================================================== */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var XLINK = 'http://www.w3.org/1999/xlink';

  // ── Node type visual config ───────────────────────────────────────
  var TYPES = {
    client:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  badge: 'CL', label: 'Client'    },
    frontend: { color: '#38bdf8', bg: 'rgba(56,189,248,0.10)',  badge: 'FE', label: 'Frontend'  },
    backend:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', badge: 'BE', label: 'Backend'   },
    database: { color: '#34d399', bg: 'rgba(52,211,153,0.10)',  badge: 'DB', label: 'Database'  },
    queue:    { color: '#fb923c', bg: 'rgba(251,146,60,0.10)',  badge: 'MQ', label: 'Queue'     },
    external: { color: '#94a3b8', bg: 'rgba(148,163,184,0.10)', badge: 'EX', label: 'External'  },
    ai:       { color: '#f472b6', bg: 'rgba(244,114,182,0.10)', badge: 'AI', label: 'AI / LLM'  },
    storage:  { color: '#64748b', bg: 'rgba(100,116,139,0.10)', badge: 'S3', label: 'Storage'   },
    ml:       { color: '#22d3ee', bg: 'rgba(34,211,238,0.10)',  badge: 'ML', label: 'ML Model'  },
    training: { color: '#a3e635', bg: 'rgba(163,230,53,0.10)', badge: 'TR', label: 'Training'  },
  };

  // ── Architecture data for all projects ───────────────────────────
  var ARCH = {

    'Invoice Flow': {
      desc: 'Automated invoicing with async background jobs and email notifications',
      nodes: [
        { id:'browser', label:'Browser',       type:'client',   x:450, y:60,
          info:'End users access the invoicing platform via browser. Supports invoice viewing, creation, and approval workflows.' },
        { id:'react',   label:'React SPA',     type:'frontend', x:450, y:175,
          info:'Single-page application built with React. Manages routing, state, invoice CRUD forms, and dashboard views with real-time approval status.' },
        { id:'flask',   label:'Flask API',     type:'backend',  x:450, y:295,
          info:'RESTful API server. Handles auth (JWT), invoice lifecycle management, approval workflow logic, and task dispatching to Celery.' },
        { id:'pg',      label:'PostgreSQL',    type:'database', x:200, y:420,
          info:'Primary relational database storing users, invoices, approval records, payment events, and full audit logs.' },
        { id:'redis',   label:'Redis Broker',  type:'queue',    x:450, y:420,
          info:'In-memory message broker for Celery. Queues background tasks such as scheduled reminders, email delivery, and report generation.' },
        { id:'celery',  label:'Celery Worker', type:'queue',    x:710, y:420,
          info:'Async distributed task worker. Processes email sends, invoice reminders, nightly reports, and overdue escalation workflows.' },
        { id:'email',   label:'Email (SMTP)',  type:'external', x:710, y:510,
          info:'SMTP / SendGrid integration for transactional emails: invoice PDFs, approval requests, payment confirmations, and overdue reminders.' },
      ],
      edges: [
        { from:'browser', to:'react',   label:'loads'          },
        { from:'react',   to:'flask',   label:'HTTP REST'      },
        { from:'flask',   to:'pg',      label:'ORM queries'    },
        { from:'flask',   to:'redis',   label:'enqueue task'   },
        { from:'redis',   to:'celery',  label:'consume'        },
        { from:'celery',  to:'email',   label:'SMTP send'      },
        { from:'celery',  to:'pg',      label:'update status'  },
      ],
    },

    'Insight CRM': {
      desc: 'Customer intelligence dashboard with real-time feeds, caching, and WebSocket push',
      nodes: [
        { id:'browser', label:'Browser',      type:'client',   x:450, y:60,
          info:'Sales and support staff access the CRM dashboard from browsers with live activity feeds and deal pipeline views.' },
        { id:'react',   label:'React SPA',    type:'frontend', x:450, y:175,
          info:'Dashboard SPA built with React. Displays customer timelines, deal pipelines, real-time activity notifications, and analytics charts.' },
        { id:'flask',   label:'Flask API',    type:'backend',  x:265, y:305,
          info:'Core REST API server handling CRM CRUD, JWT auth, customer scoring, and WebSocket event broadcasting.' },
        { id:'ws',      label:'WebSocket',    type:'backend',  x:635, y:305,
          info:'WebSocket endpoint for pushing live activity events (emails opened, calls logged, deals updated) to all connected dashboard clients.' },
        { id:'pg',      label:'PostgreSQL',   type:'database', x:200, y:440,
          info:'Primary database: customer profiles, contacts, deals, activities, notes, and analytics aggregates.' },
        { id:'redis',   label:'Redis Cache',  type:'queue',    x:660, y:440,
          info:'LRU cache for hot query results and Pub/Sub backbone for distributing real-time events to WebSocket clients.' },
      ],
      edges: [
        { from:'browser', to:'react',  label:'loads'        },
        { from:'react',   to:'flask',  label:'HTTP REST'    },
        { from:'react',   to:'ws',     label:'WebSocket'    },
        { from:'flask',   to:'pg',     label:'SQLAlchemy'   },
        { from:'flask',   to:'redis',  label:'cache + pub'  },
        { from:'ws',      to:'redis',  label:'subscribe'    },
      ],
    },

    'Pulse Commerce': {
      desc: 'Headless commerce storefront with Stripe payments and ML-powered recommendations',
      nodes: [
        { id:'browser', label:'Browser',       type:'client',   x:450, y:60,
          info:'Shoppers browse products, add to cart, checkout, and track orders through the headless storefront.' },
        { id:'react',   label:'React SPA',     type:'frontend', x:450, y:175,
          info:'Headless frontend rendering the product catalog, cart, checkout flow, order history, and personalized recommendation shelf.' },
        { id:'flask',   label:'Flask API',     type:'backend',  x:450, y:300,
          info:'Commerce API: product catalog, cart management, order lifecycle, user auth (JWT), and Stripe payment orchestration.' },
        { id:'pg',      label:'PostgreSQL',    type:'database', x:185, y:425,
          info:'Relational store for products, inventory, orders, users, reviews, and discount codes.' },
        { id:'stripe',  label:'Stripe',        type:'external', x:450, y:425,
          info:'Payment gateway for card processing, refund handling, subscription billing, and webhook event confirmations.' },
        { id:'rec',     label:'Rec. Engine',   type:'ai',       x:720, y:425,
          info:'Collaborative-filtering recommendation service. Serves personalized product suggestions based on browsing and purchase history.' },
      ],
      edges: [
        { from:'browser', to:'react',  label:'loads'           },
        { from:'react',   to:'flask',  label:'HTTP REST'       },
        { from:'flask',   to:'pg',     label:'ORM queries'     },
        { from:'flask',   to:'stripe', label:'payment intent'  },
        { from:'flask',   to:'rec',    label:'get recs'        },
      ],
    },

    'NeuralTalk': {
      desc: 'Conversational AI chatbot with local LLMs via Ollama and LangChain orchestration',
      nodes: [
        { id:'user',      label:'User',           type:'client',   x:450, y:60,
          info:'End users interact with the AI chatbot via the Streamlit web UI or programmatically via REST API clients.' },
        { id:'streamlit', label:'Streamlit UI',   type:'frontend', x:235, y:180,
          info:'Streamlit chat interface. Streams LLM responses token-by-token and maintains per-session conversation history in the sidebar.' },
        { id:'fastapi',   label:'FastAPI REST',   type:'backend',  x:665, y:180,
          info:'REST API for programmatic access. Exposes /chat, /sessions, /history, and /models endpoints with async streaming support.' },
        { id:'langchain', label:'LangChain',      type:'ai',       x:450, y:310,
          info:'Orchestration framework managing prompt templates, conversation memory chains, model selection, and multi-turn context windows.' },
        { id:'ollama',    label:'Ollama Runtime', type:'backend',  x:235, y:435,
          info:'Local LLM inference runtime. Runs DeepSeek and Qwen3 models on GPU/CPU without cloud dependency or data privacy concerns.' },
        { id:'memory',    label:'Conv. Memory',   type:'database', x:665, y:435,
          info:'In-memory (or Redis-backed) conversation buffer. Stores rolling message history for multi-turn contextual conversations.' },
        { id:'llm',       label:'DeepSeek / Qwen',type:'ai',       x:235, y:525,
          info:'Open-source LLMs serving as the intelligence layer. DeepSeek for deep reasoning tasks, Qwen3 for multilingual and code use-cases.' },
      ],
      edges: [
        { from:'user',      to:'streamlit', label:'chat UI'       },
        { from:'user',      to:'fastapi',   label:'REST call'     },
        { from:'streamlit', to:'langchain', label:'invoke chain'  },
        { from:'fastapi',   to:'langchain', label:'invoke chain'  },
        { from:'langchain', to:'ollama',    label:'generate'      },
        { from:'langchain', to:'memory',    label:'read / write'  },
        { from:'ollama',    to:'llm',       label:'inference'     },
      ],
    },

    'eCommerceAPP': {
      desc: 'Full-stack Django e-commerce platform with admin dashboard and dual database strategy',
      nodes: [
        { id:'browser',      label:'Browser',       type:'client',   x:265, y:60,
          info:'Shoppers and admins access the platform via browser. Full SSR via Django templates with progressive enhancement.' },
        { id:'django',       label:'Django App',    type:'backend',  x:265, y:185,
          info:'Core Django application handling views, URL routing, middleware, template rendering, sessions, and the storefront logic.' },
        { id:'django_admin', label:'Django Admin',  type:'backend',  x:670, y:185,
          info:'Built-in Django admin panel for product management, order review, inventory control, and user moderation.' },
        { id:'orm',          label:'Django ORM',    type:'backend',  x:265, y:320,
          info:'Object-relational mapper abstracting both PostgreSQL and MySQL queries into Python model classes and querysets.' },
        { id:'cdn',          label:'Static / CDN',  type:'storage',  x:670, y:320,
          info:'Static file serving for images, CSS, and JS via WhiteNoise in development or a CDN bucket (S3 + CloudFront) in production.' },
        { id:'pg',           label:'PostgreSQL',    type:'database', x:130, y:450,
          info:'Primary production database. Stores products, orders, users, inventory, payments, and transaction records.' },
        { id:'mysql',        label:'MySQL',         type:'database', x:430, y:450,
          info:'Secondary database for reporting, historical analytics, and legacy data migration pipelines.' },
      ],
      edges: [
        { from:'browser',      to:'django',       label:'HTTP request'   },
        { from:'browser',      to:'django_admin', label:'admin panel'    },
        { from:'django',       to:'orm',          label:'model queries'  },
        { from:'django_admin', to:'orm',          label:'admin queries'  },
        { from:'django',       to:'cdn',          label:'static files'   },
        { from:'orm',          to:'pg',           label:'primary store'  },
        { from:'orm',          to:'mysql',        label:'analytics'      },
      ],
    },

    'AwsomeApp \u2014 Social Platform': {
      desc: 'Instagram-inspired social platform with Django admin, FastAPI, React, and photo storage',
      nodes: [
        { id:'browser',      label:'Browser',       type:'client',   x:280, y:60,
          info:'Users browse feeds, follow others, like and comment on posts, and upload photos via modern web browser.' },
        { id:'django_admin', label:'Django Admin',  type:'backend',  x:680, y:60,
          info:'Admin panel for content moderation: user bans, post removal, abuse report review, and platform metrics.' },
        { id:'react',        label:'React SPA',     type:'frontend', x:280, y:190,
          info:'Dynamic SPA for the social feed, stories, profile pages, follow graph, and real-time notification panel.' },
        { id:'fastapi',      label:'FastAPI',        type:'backend',  x:280, y:325,
          info:'High-performance async REST API handling auth, posts, follows, likes, comments, and personalised feed generation.' },
        { id:'mysql',        label:'MySQL',          type:'database', x:680, y:325,
          info:'Admin and configuration data store for Django. Manages moderation logs, admin user roles, and feature flags.' },
        { id:'pg',           label:'PostgreSQL',     type:'database', x:135, y:455,
          info:'Primary social graph database: users, posts, follows, likes, comments, notification events, and feed indices.' },
        { id:'photo',        label:'Photo Storage',  type:'storage',  x:510, y:455,
          info:'S3-compatible object storage for uploaded photos, compressed thumbnails, and processed image variants.' },
      ],
      edges: [
        { from:'browser',      to:'react',        label:'loads'        },
        { from:'browser',      to:'django_admin', label:'admin UI'     },
        { from:'react',        to:'fastapi',      label:'REST calls'   },
        { from:'django_admin', to:'mysql',        label:'ORM queries'  },
        { from:'fastapi',      to:'pg',           label:'social graph' },
        { from:'fastapi',      to:'photo',        label:'upload/fetch' },
      ],
    },

    'Spam Classifier API': {
      desc: 'ML REST API with NLP preprocessing and scikit-learn classifier, dual train/infer pipelines',
      nodes: [
        { id:'dataset',    label:'Training Data',   type:'training', x:200, y:60,
          info:'Labeled SMS/email dataset (e.g. UCI Spam corpus). Used offline to fit the TF-IDF vectorizer and train the classifier.' },
        { id:'model_pkl',  label:'Model Store',     type:'storage',  x:200, y:190,
          info:'Serialized .pkl files for the fitted TF-IDF vectorizer and trained classifier. Persisted to disk after each training run.' },
        { id:'clf',        label:'ML Classifier',   type:'ml',       x:200, y:430,
          info:'Trained Naive Bayes or SVM model predicting Spam / Ham labels with confidence scores. Loaded into memory at API startup.' },
        { id:'tfidf',      label:'TF-IDF Vectorizer', type:'ml',     x:450, y:430,
          info:'scikit-learn TF-IDF vectorizer fitted on the training corpus. Converts cleaned text to sparse numerical feature vectors.' },
        { id:'preproc',    label:'NLP Preprocessor', type:'backend', x:700, y:310,
          info:'Text cleaning pipeline: lowercasing, punctuation removal, stop-word filtering, and stemming / lemmatization.' },
        { id:'fastapi',    label:'FastAPI',          type:'backend',  x:700, y:185,
          info:'REST API exposing POST /predict. Validates input text, runs the NLP pipeline, and returns label + confidence JSON.' },
        { id:'client',     label:'Client App',       type:'client',   x:700, y:60,
          info:'Any HTTP client — web app, email gateway, or mobile app — sends raw message text for real-time spam classification.' },
      ],
      edges: [
        { from:'client',   to:'fastapi',   label:'POST /predict'   },
        { from:'fastapi',  to:'preproc',   label:'clean text'      },
        { from:'preproc',  to:'tfidf',     label:'vectorize'       },
        { from:'tfidf',    to:'clf',       label:'predict'         },
        { from:'dataset',  to:'model_pkl', label:'train → save'    },
        { from:'model_pkl',to:'clf',       label:'load at startup' },
        { from:'model_pkl',to:'tfidf',     label:'load at startup' },
      ],
    },

    'CareerCopilot AI': {
      desc: 'AI job-hunting assistant automating discovery, CV tailoring, and opportunity tracking with LangChain + GPT-4',
      nodes: [
        { id:'user',       label:'User',            type:'client',   x:450, y:60,
          info:'Job seekers interact via CLI or web UI to discover matched jobs, tailor CVs, generate cover letters, and track applications.' },
        { id:'fastapi',    label:'FastAPI',          type:'backend',  x:450, y:185,
          info:'API server exposing /discover, /tailor, /apply, and /track routes. Orchestrates LangChain ReAct agent invocations.' },
        { id:'langchain',  label:'LangChain Agent',  type:'ai',       x:450, y:315,
          info:'ReAct-style reasoning agent. Selects the right tool per task: job search, resume tailoring, cover letter writing, or tracking.' },
        { id:'openai',     label:'OpenAI GPT-4',     type:'ai',       x:185, y:445,
          info:'LLM backbone powering CV tailoring, cover letter generation, job-fit scoring, and interview question generation.' },
        { id:'job_tool',   label:'Job Search Tool',  type:'external', x:450, y:445,
          info:'Web scraper and LinkedIn/Indeed API integration. Discovers relevant job postings by keywords, location, and salary range.' },
        { id:'resume_bld', label:'Resume Builder',   type:'backend',  x:720, y:445,
          info:'ATS-optimised PDF generator. Rewrites resume sections using OpenAI suggestions to match each job description.' },
        { id:'opp_db',     label:'Opportunity DB',   type:'database', x:450, y:530,
          info:'PostgreSQL store tracking discovered jobs, application status, follow-up deadlines, and AI-generated relevance scores.' },
      ],
      edges: [
        { from:'user',       to:'fastapi',    label:'request'         },
        { from:'fastapi',    to:'langchain',  label:'invoke agent'    },
        { from:'langchain',  to:'openai',     label:'LLM calls'       },
        { from:'langchain',  to:'job_tool',   label:'search jobs'     },
        { from:'langchain',  to:'resume_bld', label:'tailor resume'   },
        { from:'job_tool',   to:'opp_db',     label:'store listings'  },
      ],
    },

  };

  // ── Node geometry ─────────────────────────────────────────────────
  var NW     = 70;   // half-width
  var NH_TOP = 27;   // half-height above center
  var NH_BOT = 29;   // half-height below center (rect: y=-27 to y=+29, h=56)
  var NH_MID = 1;    // vertical center of rect (average of -27 and +29)

  function getEdgePts(src, tgt) {
    var dx = tgt.x - src.x;
    var dy = tgt.y - src.y;
    var sx, sy, tx, ty;
    if (Math.abs(dy) >= Math.abs(dx)) {
      if (dy > 0) {
        sx = src.x;        sy = src.y + NH_BOT;
        tx = tgt.x;        ty = tgt.y - NH_TOP;
      } else {
        sx = src.x;        sy = src.y - NH_TOP;
        tx = tgt.x;        ty = tgt.y + NH_BOT;
      }
    } else {
      if (dx > 0) {
        sx = src.x + NW;   sy = src.y + NH_MID;
        tx = tgt.x - NW;   ty = tgt.y + NH_MID;
      } else {
        sx = src.x - NW;   sy = src.y + NH_MID;
        tx = tgt.x + NW;   ty = tgt.y + NH_MID;
      }
    }
    return { sx: sx, sy: sy, tx: tx, ty: ty };
  }

  function makeBezier(sx, sy, tx, ty) {
    var dx = tx - sx, dy = ty - sy;
    var cp1x, cp1y, cp2x, cp2y;
    if (Math.abs(dy) >= Math.abs(dx)) {
      cp1x = sx; cp1y = (sy + ty) / 2;
      cp2x = tx; cp2y = (sy + ty) / 2;
    } else {
      cp1x = (sx + tx) / 2; cp1y = sy;
      cp2x = (sx + tx) / 2; cp2y = ty;
    }
    return 'M ' + sx + ' ' + sy + ' C ' + cp1x + ' ' + cp1y + ', ' + cp2x + ' ' + cp2y + ', ' + tx + ' ' + ty;
  }

  function svgMake(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    }
    return el;
  }

  // ── Modal state ───────────────────────────────────────────────────
  var modal       = null;
  var svgRoot     = null;
  var rootG       = null;
  var panX = 0, panY = 0, zoom = 1;
  var dragging    = false;
  var hasDragged  = false;
  var lastMX = 0, lastMY = 0;
  var selectedId  = null;
  var activeData  = null;

  // ── Build modal DOM once ──────────────────────────────────────────
  function buildModal() {
    modal = document.createElement('div');
    modal.id = 'sysdesign-modal';
    modal.className = 'sysdesign-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div class="sysdesign-inner">' +
        '<div class="sysdesign-header">' +
          '<div>' +
            '<div class="sysdesign-eyebrow">System Architecture</div>' +
            '<div class="sysdesign-title" id="sd-title"></div>' +
            '<div class="sysdesign-subdesc" id="sd-desc"></div>' +
          '</div>' +
          '<button class="sysdesign-close" id="sd-close" aria-label="Close viewer">&times;</button>' +
        '</div>' +
        '<div class="sysdesign-body">' +
          '<div class="sysdesign-canvas-wrap" id="sd-canvas-wrap">' +
            '<svg class="sysdesign-svg" id="sd-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture diagram"></svg>' +
            '<div class="sd-canvas-hint">Drag to pan &nbsp;·&nbsp; Scroll to zoom &nbsp;·&nbsp; Click node for details</div>' +
            '<div class="sysdesign-toolbar">' +
              '<button id="sd-zoom-in"  title="Zoom In">+</button>' +
              '<button id="sd-zoom-out" title="Zoom Out">&minus;</button>' +
              '<button id="sd-reset"    title="Reset View" style="font-size:.72rem">RST</button>' +
            '</div>' +
          '</div>' +
          '<div class="sysdesign-panel" id="sd-panel">' +
            '<div class="sysdesign-panel-empty" id="sd-p-empty">Click a node<br>to explore its role</div>' +
            '<div class="sysdesign-panel-content" id="sd-p-content">' +
              '<div class="sd-panel-badge" id="sd-p-badge"></div>' +
              '<div class="sd-panel-name"  id="sd-p-name"></div>' +
              '<div class="sd-panel-type"  id="sd-p-type"></div>' +
              '<div class="sd-panel-info"  id="sd-p-info"></div>' +
              '<div class="sd-panel-conns" id="sd-p-conns"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sysdesign-legend" id="sd-legend"></div>' +
      '</div>';

    document.body.appendChild(modal);

    // Close handlers
    document.getElementById('sd-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (modal.classList.contains('active') && e.key === 'Escape') closeModal(); });

    // Zoom controls
    document.getElementById('sd-zoom-in').addEventListener('click', function () {
      zoom = Math.min(3, zoom * 1.2); applyTransform();
    });
    document.getElementById('sd-zoom-out').addEventListener('click', function () {
      zoom = Math.max(0.25, zoom / 1.2); applyTransform();
    });
    document.getElementById('sd-reset').addEventListener('click', resetView);

    // Pan via drag
    var wrap = document.getElementById('sd-canvas-wrap');
    wrap.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      dragging   = true;
      hasDragged = false;
      lastMX     = e.clientX;
      lastMY     = e.clientY;
      wrap.classList.add('is-dragging');
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastMX;
      var dy = e.clientY - lastMY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
      panX += dx; panY += dy;
      lastMX = e.clientX; lastMY = e.clientY;
      applyTransform();
    });
    window.addEventListener('mouseup', function () {
      dragging = false;
      wrap.classList.remove('is-dragging');
    });

    // Wheel zoom
    wrap.addEventListener('wheel', function (e) {
      e.preventDefault();
      var factor = e.deltaY > 0 ? 0.9 : 1.11;
      zoom = Math.min(3, Math.max(0.25, zoom * factor));
      applyTransform();
    }, { passive: false });

    // Touch pan (mobile)
    var touchStart = null;
    wrap.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    wrap.addEventListener('touchmove', function (e) {
      if (e.touches.length === 1 && touchStart) {
        panX += e.touches[0].clientX - touchStart.x;
        panY += e.touches[0].clientY - touchStart.y;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        applyTransform();
      }
    }, { passive: true });
  }

  function applyTransform() {
    if (rootG) {
      rootG.setAttribute('transform', 'translate(' + panX + ',' + panY + ') scale(' + zoom + ')');
    }
  }

  function resetView() {
    panX = 0; panY = 0; zoom = 1; applyTransform();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ── Open modal for a project ──────────────────────────────────────
  function openModal(title) {
    var data = ARCH[title];
    document.getElementById('sd-title').textContent = title;
    document.getElementById('sd-desc').textContent  = data
      ? data.desc
      : 'Architecture diagram coming soon.';

    resetView();
    selectedId = null;
    activeData = data || null;
    showEmptyPanel();

    if (data) {
      renderArch(data);
      buildLegend(data);
    } else {
      clearSvg();
      var placeholder = svgMake('text', {
        x:'450', y:'285', 'text-anchor':'middle',
        fill:'rgba(255,255,255,0.18)', 'font-size':'15',
        'font-family':'JetBrains Mono, monospace',
      });
      placeholder.textContent = '// Architecture diagram coming soon';
      svgRoot.appendChild(placeholder);
      document.getElementById('sd-legend').innerHTML = '';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ── Clear SVG ─────────────────────────────────────────────────────
  function clearSvg() {
    svgRoot = document.getElementById('sd-svg');
    while (svgRoot.firstChild) svgRoot.removeChild(svgRoot.firstChild);
    svgRoot.setAttribute('viewBox', '0 0 900 570');
    rootG = null;
  }

  // ── Render architecture diagram ───────────────────────────────────
  function renderArch(data) {
    clearSvg();

    // Defs: arrowhead + glow filter
    var defs = svgMake('defs', {});

    var marker = svgMake('marker', {
      id: 'sd-arrow', markerWidth: '10', markerHeight: '7',
      refX: '9', refY: '3.5', orient: 'auto',
    });
    var poly = svgMake('polygon', { points: '0 0, 10 3.5, 0 7', fill: 'rgba(255,255,255,0.32)' });
    marker.appendChild(poly);
    defs.appendChild(marker);

    var filter = svgMake('filter', { id: 'sd-glow', x: '-40%', y: '-40%', width: '180%', height: '180%' });
    var blur   = svgMake('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '5', result: 'blur' });
    var merge  = svgMake('feMerge', {});
    var mn1    = svgMake('feMergeNode', { in: 'blur' });
    var mn2    = svgMake('feMergeNode', { in: 'SourceGraphic' });
    merge.appendChild(mn1); merge.appendChild(mn2);
    filter.appendChild(blur); filter.appendChild(merge);
    defs.appendChild(filter);

    svgRoot.appendChild(defs);

    // Root group for pan/zoom
    rootG = svgMake('g', { id: 'sd-root' });
    svgRoot.appendChild(rootG);

    // Build a fast node map
    var nodeMap = {};
    data.nodes.forEach(function (n) { nodeMap[n.id] = n; });

    // ── Draw edges ──────────────────────────────────────────────────
    var edgeGrp = svgMake('g', { class: 'sd-edges' });

    data.edges.forEach(function (e, idx) {
      var src = nodeMap[e.from];
      var tgt = nodeMap[e.to];
      if (!src || !tgt) return;

      var pts   = getEdgePts(src, tgt);
      var d     = makeBezier(pts.sx, pts.sy, pts.tx, pts.ty);
      var pathId = 'sd-ep-' + idx;

      var g = svgMake('g', {
        class: 'sd-edge',
        'data-from': e.from,
        'data-to':   e.to,
      });

      var path = svgMake('path', {
        id:            pathId,
        d:             d,
        stroke:        'rgba(255,255,255,0.2)',
        'stroke-width': '1.5',
        fill:          'none',
        'marker-end':  'url(#sd-arrow)',
        class:         'sd-edge-path',
        'data-from':   e.from,
        'data-to':     e.to,
      });
      g.appendChild(path);

      // Edge label at curve midpoint
      if (e.label) {
        var mx = (pts.sx + pts.tx) / 2;
        var my = (pts.sy + pts.ty) / 2;
        var bg = svgMake('rect', {
          x: String(mx - 30), y: String(my - 9.5),
          width: '60', height: '16', rx: '4',
          fill: 'rgba(0,0,0,0.78)', stroke: 'rgba(255,255,255,0.07)', 'stroke-width': '0.5',
        });
        var txt = svgMake('text', {
          x: String(mx), y: String(my),
          'text-anchor': 'middle', 'dominant-baseline': 'middle',
          fill: 'rgba(255,255,255,0.4)', 'font-size': '8.5',
          'font-family': 'JetBrains Mono, monospace',
        });
        txt.textContent = e.label;
        g.appendChild(bg);
        g.appendChild(txt);
      }

      // Animated flow dot along the path
      var dot = svgMake('circle', { r: '3', fill: 'rgba(245,158,11,0.75)', 'pointer-events': 'none' });
      var anim = document.createElementNS(NS, 'animateMotion');
      anim.setAttribute('dur', (1.6 + idx * 0.25) + 's');
      anim.setAttribute('repeatCount', 'indefinite');
      var mpath = document.createElementNS(NS, 'mpath');
      mpath.setAttributeNS(XLINK, 'href', '#' + pathId);
      mpath.setAttribute('href', '#' + pathId);
      anim.appendChild(mpath);
      dot.appendChild(anim);
      g.appendChild(dot);

      edgeGrp.appendChild(g);
    });

    rootG.appendChild(edgeGrp);

    // ── Draw nodes ──────────────────────────────────────────────────
    var nodeGrp = svgMake('g', { class: 'sd-nodes' });

    data.nodes.forEach(function (n) {
      var cfg = TYPES[n.type] || TYPES.external;

      var g = svgMake('g', {
        class:      'sd-node',
        transform:  'translate(' + n.x + ',' + n.y + ')',
        'data-id':  n.id,
        style:      'cursor:pointer',
        tabindex:   '0',
        role:       'button',
        'aria-label': n.label,
      });

      // Glow rect (visible on hover / select)
      var glowRect = svgMake('rect', {
        class:          'sd-node-glow',
        x: '-75', y: '-32', width: '150', height: '66', rx: '12',
        fill:           'none',
        stroke:         cfg.color,
        'stroke-width': '6',
        filter:         'url(#sd-glow)',
        opacity:        '0',
      });
      g.appendChild(glowRect);

      // Main rect
      var rect = svgMake('rect', {
        x: '-70', y: '-27', width: '140', height: '56', rx: '8',
        fill:           cfg.bg,
        stroke:         cfg.color,
        'stroke-width': '1.5',
      });
      g.appendChild(rect);

      // Badge pill (centered on top border)
      var pill = svgMake('rect', {
        x: '-19', y: '-38', width: '38', height: '20', rx: '10',
        fill: cfg.color,
      });
      g.appendChild(pill);

      var badgeTxt = svgMake('text', {
        x: '0', y: '-28',
        'text-anchor':       'middle',
        'dominant-baseline': 'middle',
        'font-size':         '8.5',
        fill:                '#000',
        'font-weight':       '800',
        'font-family':       'JetBrains Mono, monospace',
      });
      badgeTxt.textContent = cfg.badge;
      g.appendChild(badgeTxt);

      // Label
      var lbl = svgMake('text', {
        x: '0', y: '4',
        'text-anchor':       'middle',
        'dominant-baseline': 'middle',
        'font-size':         '12',
        fill:                '#ffffff',
        'font-weight':       '600',
        'font-family':       'Space Grotesk, sans-serif',
      });
      lbl.textContent = n.label;
      g.appendChild(lbl);

      // Sub-type label
      var sub = svgMake('text', {
        x: '0', y: '20',
        'text-anchor':       'middle',
        'dominant-baseline': 'middle',
        'font-size':         '8.5',
        fill:                'rgba(255,255,255,0.35)',
        'font-family':       'JetBrains Mono, monospace',
      });
      sub.textContent = cfg.label;
      g.appendChild(sub);

      // Events
      g.addEventListener('click', function (e) {
        if (hasDragged) return;
        e.stopPropagation();
        selectNode(n, data);
      });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') selectNode(n, data);
      });
      g.addEventListener('mouseenter', function () {
        highlight(n.id, data, true);
      });
      g.addEventListener('mouseleave', function () {
        if (selectedId !== n.id) highlight(n.id, data, false);
      });

      nodeGrp.appendChild(g);
    });

    rootG.appendChild(nodeGrp);

    // Click on SVG background → deselect
    svgRoot.addEventListener('click', function () {
      if (hasDragged) return;
      selectedId = null;
      clearHighlight(data);
      showEmptyPanel();
    });
  }

  // ── Node selection ────────────────────────────────────────────────
  function selectNode(node, data) {
    selectedId = node.id;
    highlight(node.id, data, true);

    var cfg = TYPES[node.type] || TYPES.external;

    var badge = document.getElementById('sd-p-badge');
    badge.textContent = cfg.badge;
    badge.style.background = cfg.color;

    document.getElementById('sd-p-name').textContent = node.label;
    document.getElementById('sd-p-type').textContent = cfg.label;
    document.getElementById('sd-p-info').textContent = node.info;

    // Connected edges
    var nodeMap = {};
    data.nodes.forEach(function (n) { nodeMap[n.id] = n; });
    var conns = data.edges.filter(function (e) {
      return e.from === node.id || e.to === node.id;
    });
    var html = '';
    if (conns.length) {
      html = '<h4>Connections</h4>';
      conns.forEach(function (e) {
        var otherId = e.from === node.id ? e.to : e.from;
        var other   = nodeMap[otherId];
        var dir     = e.from === node.id ? '→' : '←';
        if (other) {
          html += '<div class="sd-conn-item">' + dir + ' ' + other.label + '<em>' + e.label + '</em></div>';
        }
      });
    }
    document.getElementById('sd-p-conns').innerHTML = html;

    document.getElementById('sd-p-empty').style.display   = 'none';
    document.getElementById('sd-p-content').classList.add('sd-panel-visible');
  }

  function showEmptyPanel() {
    document.getElementById('sd-p-empty').style.display = 'block';
    document.getElementById('sd-p-content').classList.remove('sd-panel-visible');
  }

  // ── Highlight connected nodes/edges ───────────────────────────────
  function highlight(nodeId, data, on) {
    var connected = {}, connEdge = {};
    data.edges.forEach(function (e) {
      if (e.from === nodeId || e.to === nodeId) {
        connected[e.from] = true;
        connected[e.to]   = true;
        connEdge[e.from + '|' + e.to] = true;
      }
    });

    if (!svgRoot) return;

    svgRoot.querySelectorAll('.sd-node').forEach(function (g) {
      var id  = g.getAttribute('data-id');
      var glw = g.querySelector('.sd-node-glow');
      if (!on) {
        g.classList.remove('sd-node-dim');
        if (glw) glw.setAttribute('opacity', '0');
      } else if (id === nodeId) {
        g.classList.remove('sd-node-dim');
        if (glw) glw.setAttribute('opacity', '0.55');
      } else if (connected[id]) {
        g.classList.remove('sd-node-dim');
        if (glw) glw.setAttribute('opacity', '0');
      } else {
        g.classList.add('sd-node-dim');
        if (glw) glw.setAttribute('opacity', '0');
      }
    });

    svgRoot.querySelectorAll('.sd-edge').forEach(function (g) {
      var from = g.getAttribute('data-from');
      var to   = g.getAttribute('data-to');
      var key  = from + '|' + to;
      var path = g.querySelector('.sd-edge-path');
      if (!on) {
        g.classList.remove('sd-edge-dim', 'sd-edge-hi');
        if (path) path.setAttribute('stroke', 'rgba(255,255,255,0.2)');
      } else if (connEdge[key]) {
        g.classList.remove('sd-edge-dim');
        g.classList.add('sd-edge-hi');
        if (path) path.setAttribute('stroke', 'rgba(245,158,11,0.72)');
      } else {
        g.classList.add('sd-edge-dim');
        g.classList.remove('sd-edge-hi');
        if (path) path.setAttribute('stroke', 'rgba(255,255,255,0.06)');
      }
    });
  }

  function clearHighlight(data) {
    highlight('__none__', data, false);
  }

  // ── Build legend ──────────────────────────────────────────────────
  function buildLegend(data) {
    var used = {};
    data.nodes.forEach(function (n) { used[n.type] = true; });
    var html = '';
    Object.keys(used).forEach(function (t) {
      var cfg = TYPES[t];
      if (!cfg) return;
      html += '<span class="sd-legend-item">' +
        '<span class="sd-legend-dot" style="background:' + cfg.color + '"></span>' +
        cfg.label +
        '</span>';
    });
    document.getElementById('sd-legend').innerHTML = html;
  }

  // ── Init ──────────────────────────────────────────────────────────
  function init() {
    buildModal();

    // Delegate click on all .arch-btn elements
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.arch-btn');
      if (btn) {
        e.preventDefault();
        openModal(btn.getAttribute('data-project'));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();