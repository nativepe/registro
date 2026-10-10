/* Nativé Pedidos · aplicación */
(function () {
  'use strict';

  /* ---------- constants ---------- */
  var LIMA = ['Ancón','Ate','Barranco','Bellavista','Breña','Callao','Carabayllo','Carmen de la Legua','Chaclacayo','Chorrillos','Cieneguilla','Comas','El Agustino','Independencia','Jesús María','La Molina','La Perla','La Punta','La Victoria','Lima Cercado','Lince','Los Olivos','Lurigancho-Chosica','Lurín','Magdalena del Mar','Mi Perú','Miraflores','Pachacámac','Pucusana','Pueblo Libre','Puente Piedra','Punta Hermosa','Punta Negra','Rímac','San Bartolo','San Borja','San Isidro','San Juan de Lurigancho','San Juan de Miraflores','San Luis','San Martín de Porres','San Miguel','Santa Anita','Santa María del Mar','Santa Rosa','Santiago de Surco','Surquillo','Ventanilla','Villa El Salvador','Villa María del Triunfo'];
  var DEPS = ['Abancay','Arequipa','Ayacucho','Cajamarca','Chachapoyas','Chiclayo','Chimbote','Cusco','Huacho','Huancavelica','Huancayo','Huánuco','Huaraz','Ica','Iquitos','Juliaca','Moquegua','Moyobamba','Piura','Pucallpa','Puerto Maldonado','Puno','Tacna','Tarapoto','Trujillo','Tumbes','Cerro de Pasco','Chincha','Pisco','Sullana','Talara','Jaén','Tingo María','Huaral','Cañete'];
  var AGENCIAS = ['Shalom','Olva Courier','Marvisur','Cruz del Sur Cargo','Flores Cargo','Otra'];
  var METODOS = ['Yape','Plin','Transferencia','Efectivo','Tarjeta'];
  var FRANJAS = ['9–13 h','13–18 h','18–21 h','Por coordinar'];
  var PAYST = { pagado: 'Pagado', adelanto: 'Adelanto', contra: 'Contra entrega' };
  var DELIV = { lima: 'Delivery Lima', provincia: 'Provincia', recojo: 'Recojo' };
  var STEPS = ['nuevo', 'empacado', 'enruta', 'entregado'];
  var STABS = [['todos','Todos'],['nuevo','Nuevos'],['empacado','Empacados'],['enruta','En camino'],['entregado','Entregados'],['anulado','Anulados']];
  var PERIODS = [['hoy','Hoy'],['7','7 días'],['30','30 días'],['todo','Todo']];
  var PERIOD_TXT = { hoy: 'hoy', '7': 'últimos 7 días', '30': 'últimos 30 días', todo: 'todo el historial' };
  var DAY = 864e5;
  var LS_DATA = 'native-pedidos-v1', LS_DRAFT = 'native-pedidos-draft', LS_PREF = 'native-pedidos-pref', LS_BK = 'native-pedidos-backup-at';

  var SV = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var I = {
    plus: '<svg class="i" ' + SV + '><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg class="i" ' + SV + '><path d="M5 12h14"/></svg>',
    x: '<svg class="i" ' + SV + '><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
    check: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    lima: '<svg class="i" ' + SV + '><path d="M2.5 6.5h11v9h-11z"/><path d="M13.5 9.5h4l3 3.2v2.8h-7"/><circle cx="6.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/></svg>',
    provincia: '<svg class="i" ' + SV + '><path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5L12 11.5l8.5-4M12 11.5v9"/></svg>',
    recojo: '<svg class="i" ' + SV + '><path d="M4.5 10v9.5h15V10"/><path d="M3 10l1.8-5.5h14.4L21 10z"/><path d="M9.5 19.5v-5h5v5"/></svg>',
    copy: '<svg class="i" ' + SV + '><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6.2c0-.9-.8-1.7-1.7-1.7H6.2c-.9 0-1.7.8-1.7 1.7v7.6c0 .9.8 1.7 1.7 1.7h2.3"/></svg>',
    chat: '<svg class="i" ' + SV + '><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6z"/></svg>',
    edit: '<svg class="i" ' + SV + '><path d="M4.5 19.5h4l10-10-4-4-10 10z"/><path d="M13 7l4 4"/></svg>',
    pin: '<svg class="i" ' + SV + '><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    cal: '<svg class="i" ' + SV + '><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>'
  };

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var r2 = function (n) { return Math.round((Number(n) || 0) * 100) / 100; };
  var num = function (v) { var n = parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
  var digits = function (s) { return String(s || '').replace(/\D/g, ''); };
  var norm = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); };
  var pad = function (n, w) { return String(n).padStart(w || 4, '0'); };
  var uid = function (p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var strip = function (o) { var b = clone(o); delete b.id; return b; };
  var fmtMoney;
  try { fmtMoney = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch (e) { fmtMoney = null; }
  var money = function (n) {
    var v = r2(n);
    if (fmtMoney) return fmtMoney.format(v).replace(/ /g, ' ');
    return 'S/ ' + v.toFixed(2);
  };
  var fmtPhone = function (s) { var d = digits(s); return d.length === 9 ? d.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : (s || ''); };
  var dShort = new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });
  var dLong = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  var tShort = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  var clean = function (s) { return String(s).replace(/\./g, '').replace(/,/g, ''); };
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  function startOfDay(t) { var d = t ? new Date(t) : new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function isoLocal(t) { var d = t ? new Date(t) : new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1, 2) + '-' + pad(d.getDate(), 2); }
  function dayLabel(t) { return clean(dShort.format(t)); }
  function relDay(t) { var s = startOfDay(); if (t >= s) return 'hoy'; if (t >= s - DAY) return 'ayer'; return dayLabel(t); }
  function when(t) { return relDay(t) + ', ' + tShort.format(t); }
  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-').map(Number); var t = new Date(p[0], p[1] - 1, p[2]).getTime();
    var diff = Math.round((t - startOfDay()) / DAY);
    if (diff === 0) return 'hoy'; if (diff === 1) return 'mañana'; if (diff === -1) return 'ayer';
    return dayLabel(t);
  }
  function stLabel(s, type) {
    if (s === 'enruta') return type === 'provincia' ? 'En agencia' : type === 'recojo' ? 'Listo para recojo' : 'En ruta';
    return { nuevo: 'Nuevo', empacado: 'Empacado', entregado: 'Entregado', anulado: 'Anulado' }[s] || s;
  }
  function orderNo(o) { return o.ejemplo ? 'EJ-' + pad(o.num || 0, 2) : pad(o.num || 0, 4); }
  function balance(o) { return r2(Math.max(0, (o.total || 0) - ((o.payment && o.payment.paid) || 0))); }
  function lsGet(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  /* ---------- state ---------- */
  function blankForm() {
    return { phone: '', name: '', doc: '', items: [], deliveryType: 'lima', district: '', address: '', reference: '', agency: AGENCIAS[0], city: '', recipientDoc: '', date: isoLocal(), slot: FRANJAS[1], payMethod: 'Yape', payStatus: 'pagado', advance: '', opNumber: '', shipping: '', discount: '', notes: '' };
  }
  var pref = lsGet(LS_PREF) || {};
  var S = {
    orders: [], products: [], ready: false, loaded: { orders: false, products: false }, canWrite: true,
    view: 'nuevo', period: pref.period || '7', stab: 'todos', oq: '', pq: '',
    form: blankForm(), editingId: null, match: null, customers: new Map(),
    openId: null, confirmDel: false, confirmEx: false, catEdit: null, catDel: null,
    user: null, meId: null, downloads: null, inViewer: !!(window.claude && typeof window.claude.use === 'function'),
    busy: false
  };
  var store = null;

  /* ---------- stores ---------- */
  function localStore() {
    var data = lsGet(LS_DATA) || { orders: {}, products: {} };
    var ok = lsSet('native-pedidos-probe', 1); lsSet('native-pedidos-probe', null);
    var cb = null;
    function emit() {
      cb('orders', Object.keys(data.orders).map(function (id) { var o = clone(data.orders[id]); o.id = id; return o; }));
      cb('products', Object.keys(data.products).map(function (id) { var p = clone(data.products[id]); p.id = id; return p; }));
    }
    function persist() { lsSet(LS_DATA, data); emit(); return Promise.resolve(); }
    return {
      mode: ok ? 'local' : 'mem',
      start: function (fn) {
        cb = fn; emit();
        window.addEventListener('storage', function (e) { if (e.key === LS_DATA) { data = lsGet(LS_DATA) || { orders: {}, products: {} }; emit(); } });
      },
      exportAll: function () { return clone(data); },
      importAll: function (inc) {
        var n = { orders: 0, products: 0 };
        ['orders', 'products'].forEach(function (k) {
          var src = inc[k] || {};
          Object.keys(src).forEach(function (id) {
            var b = src[id]; if (!b || typeof b !== 'object' || Array.isArray(b)) return;
            var cur = data[k][id];
            var tb = b.updatedAt || b.createdAt || 0, tc = cur ? (cur.updatedAt || cur.createdAt || 0) : -1;
            if (!cur || tb > tc) { data[k][id] = clone(b); n[k]++; }
          });
        });
        persist();
        return n;
      },
      setOrder: function (id, b) { data.orders[id] = clone(b); return persist(); },
      deleteOrder: function (id) { delete data.orders[id]; return persist(); },
      setProduct: function (id, b) { data.products[id] = clone(b); return persist(); },
      deleteProduct: function (id) { delete data.products[id]; return persist(); }
    };
  }
  function dbStore(db) {
    function retry(fn) {
      return fn().catch(function (e) {
        if (e && e.code === 'unavailable') return new Promise(function (r) { setTimeout(r, 400 + Math.random() * 700); }).then(fn);
        throw e;
      });
    }
    function rows(snap) { return snap.docs.map(function (d) { var o = Object.assign({}, d.data()); o.id = d.id; return o; }); }
    function onErr(e) { setSync('error'); toast(e && e.code === 'revoked' ? 'Tu acceso a esta plataforma cambió. Recarga la página.' : 'Se perdió la conexión con la base de pedidos. Recarga la página para reconectar.'); }
    return {
      mode: 'db',
      start: function (fn) {
        db.collection('pedidos').onSnapshot(function (s) { fn('orders', rows(s)); }, onErr);
        db.collection('productos').onSnapshot(function (s) { fn('products', rows(s)); }, onErr);
      },
      setOrder: function (id, b) { return retry(function () { return db.collection('pedidos').doc(id).set(b); }); },
      deleteOrder: function (id) { return retry(function () { return db.collection('pedidos').doc(id).delete(); }); },
      setProduct: function (id, b) { return retry(function () { return db.collection('productos').doc(id).set(b); }); },
      deleteProduct: function (id) { return retry(function () { return db.collection('productos').doc(id).delete(); }); }
    };
  }
  function writeErr(e) {
    var code = e && e.code;
    if (code === 'invalid_argument') { S.canWrite = false; renderPerm(); toast('No se guardó: tu acceso a esta plataforma es de solo lectura.'); }
    else if (code === 'quota_exceeded') toast('La base de pedidos llegó a su límite. Elimina pedidos de ejemplo o antiguos para seguir registrando.');
    else if (code === 'revoked') toast('Tu acceso cambió mientras trabajabas. Recarga la página.');
    else toast('No se pudo guardar. Revisa tu conexión e inténtalo otra vez.');
  }

  function onData(kind, arr) {
    if (kind === 'orders') {
      S.orders = arr.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
      buildCustomers();
    } else {
      S.products = arr.sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'es'); });
    }
    S.loaded[kind] = true;
    S.ready = S.loaded.orders && S.loaded.products;
    renderAll();
  }

  function setSync(s) {
    var el = $('#sync'); el.dataset.s = s;
    $('#sync-t').textContent = { connecting: 'Conectando…', db: 'Sincronizado', local: 'Guardado en este navegador', mem: 'Sin guardar: el navegador bloquea el almacenamiento', error: 'Sin conexión' }[s] || '';
  }

  /* ---------- derived ---------- */
  function buildCustomers() {
    var m = new Map();
    S.orders.slice().sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); }).forEach(function (o) {
      var ph = digits(o.customer && o.customer.phone).slice(-9); if (ph.length < 6) return;
      var c = m.get(ph) || { count: 0 };
      c.count++; c.name = o.customer.name; c.doc = o.customer.doc || c.doc; c.lastAt = o.createdAt; c.lastDelivery = o.delivery;
      m.set(ph, c);
    });
    S.customers = m;
  }
  function nextNum() {
    var mx = 0; S.orders.forEach(function (o) { if (!o.ejemplo && (o.num || 0) > mx) mx = o.num; });
    return mx + 1;
  }
  function calc(f) {
    var subtotal = r2(f.items.reduce(function (a, i) { return a + num(i.price) * num(i.qty); }, 0));
    var shipping = r2(num(f.shipping)), discount = r2(num(f.discount));
    var total = r2(Math.max(0, subtotal + shipping - discount));
    var paid = f.payStatus === 'pagado' ? total : f.payStatus === 'adelanto' ? Math.min(total, r2(num(f.advance))) : 0;
    return { subtotal: subtotal, shipping: shipping, discount: discount, total: total, paid: paid, balance: r2(total - paid) };
  }
  function inPeriod(o) {
    if (S.period === 'todo') return true;
    var s = startOfDay(); var from = S.period === 'hoy' ? s : s - (Number(S.period) - 1) * DAY;
    return (o.createdAt || 0) >= from;
  }
  function matchQ(o) {
    var q = norm(S.oq); if (!q) return true;
    var hay = norm([orderNo(o), o.customer && o.customer.name, o.delivery && o.delivery.district, o.delivery && o.delivery.city, o.delivery && o.delivery.agency].concat((o.items || []).map(function (i) { return i.name; })).join(' '));
    if (hay.indexOf(q) > -1) return true;
    var dq = digits(S.oq);
    return dq.length >= 3 && digits(o.customer && o.customer.phone).indexOf(dq) > -1;
  }
  function delivWhere(o) {
    var d = o.delivery || {};
    if (d.type === 'provincia') return (d.agency || 'Agencia') + ' · ' + (d.city || '—');
    if (d.type === 'recojo') return 'Recojo en tienda';
    return d.district || 'Lima';
  }
  function delivWhen(o) {
    var d = o.delivery || {}; var w = fmtDate(d.date);
    var lead = d.type === 'recojo' ? 'Recoge ' : d.type === 'provincia' ? 'Envía ' : 'Entrega ';
    return w ? lead + w + (d.slot && d.type !== 'provincia' ? ' · ' + d.slot : '') : '';
  }

  /* ---------- render: chrome ---------- */
  function renderAll() {
    S.match = lookupCustomer();
    renderHeader(); renderBanner(); renderPicks(); renderTicket(); renderRecent(); renderMatch();
    if (S.view === 'pedidos') renderPedidos();
    if (S.view === 'catalogo') renderCatalog();
    if (S.openId) renderDrawer();
  }
  function renderHeader() {
    var n = S.orders.filter(function (o) { return o.status === 'nuevo' || o.status === 'empacado'; }).length;
    var b = $('#badge'); b.hidden = !n; b.textContent = n;
  }
  function renderPerm() {
    $('#robar').hidden = S.canWrite;
    $$('[data-act="submit"],#cat-save').forEach(function (b) { b.disabled = !S.canWrite; });
  }
  function renderBanner() {
    var eo = S.orders.filter(function (o) { return o.ejemplo; }).length;
    var ep = S.products.filter(function (p) { return p.ejemplo; }).length;
    var bar = $('#exbar');
    if (!eo && !ep) { bar.hidden = true; S.confirmEx = false; return; }
    bar.hidden = false;
    var parts = [];
    if (eo) parts.push(eo + (eo === 1 ? ' pedido' : ' pedidos'));
    if (ep) parts.push(ep + (ep === 1 ? ' producto' : ' productos'));
    $('#exbar-t').textContent = S.confirmEx
      ? '¿Borrar ' + parts.join(' y ') + ' de ejemplo? Tus registros propios no se tocan.'
      : 'Cargamos ' + parts.join(' y ') + ' de ejemplo para que veas la plataforma en marcha. Bórralos antes de empezar con tus ventas reales.';
    $('#exbar-act').innerHTML = !S.canWrite ? '' : S.confirmEx
      ? '<button type="button" class="btn sm" data-act="ex-no">Cancelar</button><button type="button" class="btn sm danger" data-act="ex-yes">Sí, borrar ejemplos</button>'
      : '<button type="button" class="btn sm" data-act="ex-ask">Borrar ejemplos</button>';
  }

  /* ---------- render: nuevo pedido ---------- */
  function buildStatic() {
    $('#today').textContent = cap(dLong.format(new Date()));
    $('#dl-districts').innerHTML = LIMA.map(function (d) { return '<option value="' + esc(d) + '">'; }).join('');
    $('#dl-deps').innerHTML = DEPS.map(function (d) { return '<option value="' + esc(d) + '">'; }).join('');
    $('#f-agency').innerHTML = AGENCIAS.map(function (a) { return '<option>' + esc(a) + '</option>'; }).join('');
    $('#f-slot').innerHTML = FRANJAS.map(function (a) { return '<option>' + esc(a) + '</option>'; }).join('');
    $('#seg-delivery').innerHTML = ['lima', 'provincia', 'recojo'].map(function (k) { return '<button type="button" data-seg="deliveryType" data-v="' + k + '">' + I[k] + DELIV[k] + '</button>'; }).join('');
    $('#chips-method').innerHTML = METODOS.map(function (m) { return '<button type="button" class="chip" data-seg="payMethod" data-v="' + m + '">' + m + '</button>'; }).join('');
    $('#seg-pay').innerHTML = ['pagado', 'adelanto', 'contra'].map(function (k) { return '<button type="button" data-seg="payStatus" data-v="' + k + '">' + PAYST[k] + '</button>'; }).join('');
    $('#seg-period').innerHTML = PERIODS.map(function (p) { return '<button type="button" data-period="' + p[0] + '">' + p[1] + '</button>'; }).join('');
    $('#free-btn').innerHTML = I.plus + 'Ítem libre';
  }
  function syncSegs() {
    $$('[data-seg]').forEach(function (b) { b.setAttribute('aria-pressed', String(S.form[b.dataset.seg] === b.dataset.v)); });
    var f = S.form;
    $('#dl-lima').hidden = f.deliveryType !== 'lima';
    $('#dl-prov').hidden = f.deliveryType !== 'provincia';
    $('#slot-wrap').hidden = f.deliveryType === 'provincia';
    $('#l-date').textContent = f.deliveryType === 'recojo' ? 'Fecha de recojo' : f.deliveryType === 'provincia' ? 'Fecha de envío' : 'Fecha de entrega';
    var adv = f.payStatus === 'adelanto';
    var op = f.payStatus !== 'contra' && ['Yape', 'Plin', 'Transferencia'].indexOf(f.payMethod) > -1;
    $('#adv-wrap').hidden = !adv; $('#op-wrap').hidden = !op; $('#pay-extra').hidden = !adv && !op;
  }
  function fillForm() {
    $$('[data-f]').forEach(function (el) { var v = S.form[el.dataset.f]; el.value = v == null ? '' : v; });
    $$('[aria-invalid="true"]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    $$('.err').forEach(function (el) { el.hidden = true; });
    var editing = S.editingId && S.orders.find(function (o) { return o.id === S.editingId; });
    $('#editbar').hidden = !editing;
    if (editing) $('#editbar-t').innerHTML = '<b>Editando el pedido N° ' + esc(orderNo(editing)) + '</b> de ' + esc(editing.customer && editing.customer.name) + '. Los cambios reemplazan al pedido original.';
    $('#nv-title').textContent = editing ? 'Editar pedido' : 'Nuevo pedido';
    $('#nv-eyebrow').textContent = editing ? 'N° ' + orderNo(editing) : 'Registro rápido';
    S.match = lookupCustomer();
    syncSegs(); renderPicks(); renderLines(); renderTicket(); renderMatch();
  }
  function lookupCustomer() {
    var d = digits(S.form.phone).slice(-9);
    return d.length === 9 ? (S.customers.get(d) || null) : null;
  }
  function renderMatch() {
    var el = $('#match'), c = S.match;
    if (!c) { el.hidden = true; return; }
    el.hidden = false;
    var ld = c.lastDelivery || {};
    var canUse = ld.type === 'lima' && ld.address && !S.form.address.trim();
    el.innerHTML = '<span class="dot"></span><span><b>Ya es cliente</b> · ' + c.count + (c.count === 1 ? ' pedido' : ' pedidos') + ' · último: ' + esc(relDay(c.lastAt)) + '</span>' +
      (canUse ? '<button type="button" class="link" data-act="use-addr">Usar su dirección de ' + esc(ld.district || 'Lima') + '</button>' : '');
  }
  function renderPicks() {
    var box = $('#picks');
    if (!S.ready) { box.innerHTML = '<div class="empty">Cargando catálogo…</div>'; return; }
    var act = S.products.filter(function (p) { return p.active !== false; });
    if (!act.length) {
      box.innerHTML = '<div class="empty"><p>' + (S.products.length ? 'Todos tus productos están pausados.' : 'Tu catálogo está vacío. Agrega tus productos con su precio y registrarás cada pedido con un par de toques.') + '</p><div class="row"><button type="button" class="btn sm" data-view="catalogo">Ir al catálogo</button>' + (!S.products.length && S.canWrite ? '<button type="button" class="btn sm ghost" data-act="load-ex">Cargar ejemplos</button>' : '') + '</div></div>';
      return;
    }
    var q = norm(S.pq);
    var list = q ? act.filter(function (p) { return norm(p.name + ' ' + (p.pres || '')).indexOf(q) > -1; }) : act;
    if (!list.length) {
      box.innerHTML = '<div class="empty"><p>Ningún producto coincide con “' + esc(S.pq) + '”.</p><div class="row"><button type="button" class="btn sm" data-act="free-q">' + I.plus + 'Agregar “' + esc(S.pq) + '” como ítem libre</button></div></div>';
      return;
    }
    box.innerHTML = list.map(function (p) {
      var it = S.form.items.find(function (i) { return i.pid === p.id; });
      return '<button type="button" class="pick' + (it ? ' on' : '') + '" data-act="pick" data-id="' + esc(p.id) + '"><b>' + esc(p.name) + '</b><small>' + esc(p.pres || '') + '</small><span class="pp">' + money(p.price) + '</span>' + (it ? '<span class="q">' + esc(num(it.qty)) + '</span>' : '') + '</button>';
    }).join('');
  }
  function renderLines() {
    var box = $('#lines'), items = S.form.items;
    box.hidden = !items.length;
    if (!items.length) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="line line-h" aria-hidden="true"><span>Detalle</span><span>Precio unit.</span><span>Cantidad</span><span class="r">Importe</span><span></span></div>' + items.map(function (it) {
      return '<div class="line" data-key="' + esc(it.key) + '">' +
        '<div class="ln-name">' + (it.pid ? '<b>' + esc(it.name) + '</b>' + (it.pres ? '<small>' + esc(it.pres) + '</small>' : '') : '<input class="in sm" data-li="name" value="' + esc(it.name) + '" placeholder="Descripción del ítem" aria-label="Descripción del ítem">') + '</div>' +
        '<div class="ln-price"><span class="money-in"><span>S/</span><input data-li="price" inputmode="decimal" value="' + esc(it.price) + '" aria-label="Precio unitario"></span></div>' +
        '<div class="ln-qty"><span class="stepper"><button type="button" data-act="dec" aria-label="Uno menos">' + I.minus + '</button><input data-li="qty" inputmode="numeric" value="' + esc(it.qty) + '" aria-label="Cantidad"><button type="button" data-act="inc" aria-label="Uno más">' + I.plus + '</button></span></div>' +
        '<div class="ln-sub">' + money(num(it.price) * num(it.qty)) + '</div>' +
        '<button type="button" class="icon-btn" data-act="rm" aria-label="Quitar ' + esc(it.name || 'ítem') + '">' + I.x + '</button></div>';
    }).join('');
  }
  function updateLine(key) {
    var it = S.form.items.find(function (i) { return i.key === key; });
    var row = $('.line[data-key="' + key + '"]');
    if (!it || !row) return;
    var q = row.querySelector('[data-li="qty"]'); if (document.activeElement !== q) q.value = it.qty;
    row.querySelector('.ln-sub').textContent = money(num(it.price) * num(it.qty));
  }
  function renderTicket() {
    var f = S.form, c = calc(f);
    var editing = S.editingId && S.orders.find(function (o) { return o.id === S.editingId; });
    $('#t-no').textContent = 'N° ' + (editing ? orderNo(editing) : (S.ready ? pad(nextNum()) : '----'));
    var where = '';
    if (f.deliveryType === 'lima') where = f.district ? f.district + (f.address ? ' · ' + f.address : '') : 'Delivery en Lima';
    else if (f.deliveryType === 'provincia') where = (f.agency || 'Agencia') + ' → ' + (f.city || 'destino');
    else where = 'Recojo en tienda';
    var dt = fmtDate(f.date); var whenTxt = dt ? cap(dt) + (f.slot && f.deliveryType !== 'provincia' ? ' · ' + f.slot : '') : 'Sin fecha';
    $('#t-cust').innerHTML = '<span class="nm">' + (f.name.trim() ? esc(f.name) : '<span class="muted">Cliente</span>') + '</span>' +
      (digits(f.phone) ? '<span class="meta">' + esc(fmtPhone(digits(f.phone))) + '</span>' : '') +
      '<span class="meta">' + I[f.deliveryType] + '<span>' + esc(where) + '</span></span>' +
      '<span class="meta">' + I.cal + '<span>' + esc(whenTxt) + '</span></span>';
    $('#t-lines').innerHTML = f.items.length ? f.items.map(function (i) {
      return '<li><span class="q">' + esc(num(i.qty)) + '×</span><span class="n">' + esc(i.name || 'Ítem libre') + '</span><span class="num">' + money(num(i.price) * num(i.qty)) + '</span></li>';
    }).join('') : '<li class="empty-li">Sin productos todavía</li>';
    $('#t-sub').textContent = money(c.subtotal);
    $('#t-total').textContent = money(c.total);
    $('#m-total').textContent = money(c.total);
    var pay = esc(f.payMethod) + ' · ' + PAYST[f.payStatus];
    if (f.payStatus === 'adelanto') pay = 'Adelanto por ' + esc(f.payMethod) + ' · <b>saldo ' + money(c.balance) + '</b>';
    if (f.payStatus === 'contra') pay = 'Contra entrega · <b>cobrar ' + money(c.total) + '</b>';
    $('#t-pay').innerHTML = pay;
    $('#submit-t').textContent = editing ? 'Guardar cambios' : 'Registrar pedido';
    $('#m-submit').textContent = editing ? 'Guardar' : 'Registrar';
  }
  function renderRecent() {
    var box = $('#recent');
    if (!S.ready) { box.innerHTML = '<p class="none">Cargando…</p>'; return; }
    var list = S.orders.slice(0, 5);
    if (!list.length) { box.innerHTML = '<p class="none">Aquí verás cada pedido apenas lo registres.</p>'; return; }
    box.innerHTML = list.map(function (o) {
      return '<button type="button" class="rrow" data-act="open" data-id="' + esc(o.id) + '"><span class="mono">' + esc(orderNo(o)) + '</span><span class="nm">' + esc(o.customer && o.customer.name) + '</span><span class="num">' + money(o.total) + '</span><i class="sdot" data-s="' + esc(o.status) + '" title="' + esc(stLabel(o.status, o.delivery && o.delivery.type)) + '"></i></button>';
    }).join('');
  }

  /* ---------- form actions ---------- */
  var draftT = null;
  function saveDraft() {
    if (S.editingId) return;
    clearTimeout(draftT);
    draftT = setTimeout(function () { lsSet(LS_DRAFT, S.form); }, 350);
  }
  function addItem(p) {
    var it = S.form.items.find(function (i) { return i.pid === p.id; });
    if (it) it.qty = Math.max(1, Math.round(num(it.qty))) + 1;
    else S.form.items.push({ key: uid('l'), pid: p.id, name: p.name, pres: p.pres || '', price: r2(p.price).toFixed(2), qty: 1 });
    $('#e-items').hidden = true;
    renderLines(); renderPicks(); renderTicket(); saveDraft();
  }
  function addFree(name) {
    var it = { key: uid('l'), pid: null, name: name || '', pres: '', price: '', qty: 1 };
    S.form.items.push(it);
    $('#e-items').hidden = true;
    renderLines(); renderTicket(); saveDraft();
    var row = $('.line[data-key="' + it.key + '"]');
    if (row) (name ? row.querySelector('[data-li="price"]') : row.querySelector('[data-li="name"]')).focus();
  }
  function resetForm(keepFocus) {
    S.form = blankForm(); S.editingId = null; S.pq = ''; $('#p-q').value = '';
    lsSet(LS_DRAFT, null);
    fillForm();
    if (!keepFocus) $('#f-phone').focus({ preventScroll: true });
  }
  function loadForEdit(o) {
    var d = o.delivery || {}, p = o.payment || {};
    S.form = {
      phone: fmtPhone(o.customer && o.customer.phone), name: (o.customer && o.customer.name) || '', doc: (o.customer && o.customer.doc) || '',
      items: (o.items || []).map(function (i) { return { key: uid('l'), pid: i.pid || null, name: i.name, pres: i.pres || '', price: r2(i.price).toFixed(2), qty: i.qty }; }),
      deliveryType: d.type || 'lima', district: d.district || '', address: d.address || '', reference: d.reference || '', agency: d.agency || AGENCIAS[0], city: d.city || '', recipientDoc: d.recipientDoc || '', date: d.date || '', slot: d.slot || FRANJAS[1],
      payMethod: p.method || 'Yape', payStatus: p.status || 'pagado', advance: p.status === 'adelanto' ? r2(p.paid).toFixed(2) : '', opNumber: p.op || '',
      shipping: o.shipping ? r2(o.shipping).toFixed(2) : '', discount: o.discount ? r2(o.discount).toFixed(2) : '', notes: o.notes || ''
    };
    S.editingId = o.id;
    closeDrawer();
    setView('nuevo');
    fillForm();
  }
  function validate() {
    var f = S.form, errs = [], ph = digits(f.phone);
    if (ph.length < 6 || ph.length > 15) errs.push(['f-phone', 'e-phone', 'Ingresa el celular del cliente (9 dígitos).']);
    if (!f.name.trim()) errs.push(['f-name', 'e-name', 'Escribe el nombre del cliente.']);
    if (!f.items.length) errs.push(['p-q', 'e-items', 'Agrega al menos un producto.']);
    else if (f.items.some(function (i) { return !String(i.name).trim(); })) errs.push([null, 'e-items', 'Escribe la descripción de cada ítem libre.']);
    if (f.deliveryType === 'lima') {
      if (!f.district.trim()) errs.push(['f-district', 'e-district', 'Indica el distrito.']);
      if (!f.address.trim()) errs.push(['f-address', 'e-address', 'Indica la dirección de entrega.']);
    }
    if (f.deliveryType === 'provincia') {
      if (!f.city.trim()) errs.push(['f-city', 'e-city', 'Indica la ciudad de destino.']);
      if (digits(f.recipientDoc).length !== 8) errs.push(['f-rdoc', 'e-rdoc', 'La agencia pide el DNI (8 dígitos) de quien recoge.']);
    }
    if (f.payStatus === 'adelanto') {
      var c = calc(f), a = num(f.advance);
      if (a <= 0) errs.push(['f-advance', 'e-advance', 'Ingresa el monto adelantado.']);
      else if (a >= c.total) errs.push(['f-advance', 'e-advance', 'El adelanto cubre el total: marca el pago como Pagado.']);
    }
    return errs;
  }
  function submit() {
    if (S.busy) return;
    if (!S.canWrite) { toast('Tu acceso es de solo lectura: no puedes registrar pedidos.'); return; }
    if (S.view !== 'nuevo') setView('nuevo');
    var errs = validate();
    $$('[aria-invalid="true"]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    $$('.err').forEach(function (el) { el.hidden = true; });
    if (errs.length) {
      errs.forEach(function (e) {
        if (e[0] && e[0] !== 'p-q') $('#' + e[0]).setAttribute('aria-invalid', 'true');
        var er = $('#' + e[1]); er.textContent = e[2]; er.hidden = false;
      });
      var first = errs[0][0] ? $('#' + errs[0][0]) : $('#' + errs[0][1]);
      if (first) { first.scrollIntoView({ block: 'center', behavior: 'smooth' }); if (first.focus) first.focus({ preventScroll: true }); }
      toast(errs.length === 1 ? errs[0][2] : 'Faltan ' + errs.length + ' datos para registrar el pedido.');
      return;
    }
    var f = S.form, c = calc(f), now = Date.now();
    var editing = S.editingId ? S.orders.find(function (o) { return o.id === S.editingId; }) : null;
    var body = {
      num: editing ? editing.num : nextNum(), ejemplo: editing ? !!editing.ejemplo : false,
      createdAt: editing ? editing.createdAt : now, updatedAt: now, createdBy: editing ? (editing.createdBy || null) : (S.meId || null),
      customer: { name: f.name.trim(), phone: digits(f.phone), doc: f.doc.trim() },
      delivery: {
        type: f.deliveryType,
        district: f.deliveryType === 'lima' ? f.district.trim() : '', address: f.deliveryType === 'lima' ? f.address.trim() : '', reference: f.deliveryType === 'lima' ? f.reference.trim() : '',
        agency: f.deliveryType === 'provincia' ? f.agency : '', city: f.deliveryType === 'provincia' ? f.city.trim() : '', recipientDoc: f.deliveryType === 'provincia' ? digits(f.recipientDoc) : '',
        date: f.date || '', slot: f.deliveryType === 'provincia' ? '' : f.slot
      },
      items: f.items.map(function (i) { return { pid: i.pid || null, name: String(i.name).trim(), pres: i.pres || '', price: r2(num(i.price)), qty: Math.max(1, Math.round(num(i.qty))) }; }),
      subtotal: c.subtotal, shipping: c.shipping, discount: c.discount, total: c.total,
      payment: { method: f.payMethod, status: f.payStatus, paid: c.paid, op: (f.payStatus !== 'contra' ? f.opNumber.trim() : '') },
      status: editing ? editing.status : 'nuevo',
      history: editing ? (editing.history || []) : [{ s: 'nuevo', at: now }],
      notes: f.notes.trim()
    };
    if (editing && editing.payment && editing.payment.collectedWith && f.payStatus === 'pagado') { body.payment.collectedWith = editing.payment.collectedWith; body.payment.collectedAt = editing.payment.collectedAt || null; }
    var id = editing ? editing.id : uid('o');
    S.busy = true; $('#submit').disabled = true;
    store.setOrder(id, body).then(function () {
      var saved = Object.assign({ id: id }, body);
      toast((editing ? 'Cambios guardados en el pedido N° ' : 'Pedido N° ') + orderNo(saved) + (editing ? '' : ' registrado') + ' · ' + money(body.total), [
        { label: 'Copiar resumen', fn: function () { copyText(summary(saved), 'Resumen copiado. Pégalo en WhatsApp.'); } },
        { label: 'Ver', fn: function () { openDrawer(id); } }
      ]);
      resetForm();
    }).catch(writeErr).then(function () { S.busy = false; $('#submit').disabled = !S.canWrite; });
  }

  /* ---------- pedidos view ---------- */
  function renderPedidos() {
    $$('[data-period]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.period === S.period)); });
    $('#csv-btn').hidden = S.inViewer && !S.downloads;
    renderMetrics(); renderList(); renderBackup();
  }
  function renderBackup() {
    var box = $('#backup');
    box.hidden = !(store && store.exportAll);
    if (box.hidden) return;
    var at = lsGet(LS_BK);
    $('#backup-p').innerHTML = 'Los pedidos y el catálogo de esta página se guardan <b>solo en este navegador</b>. Descarga un respaldo con frecuencia: te protege si se borran los datos del navegador y te permite pasar tu información a otro equipo. ' +
      (at ? 'Último respaldo: <b>' + esc(relDay(at)) + '</b>.' : '<b>Aún no has descargado ningún respaldo.</b>');
  }
  function spark() {
    var days = 14, s = startOfDay(), vals = [];
    for (var i = days - 1; i >= 0; i--) {
      var from = s - i * DAY, to = from + DAY;
      vals.push(S.orders.reduce(function (a, o) { return o.status !== 'anulado' && o.createdAt >= from && o.createdAt < to ? a + (o.total || 0) : a; }, 0));
    }
    var max = Math.max.apply(null, vals.concat([1])), W = 140, H = 36, g = 3, bw = (W - g * (days - 1)) / days;
    return '<div><svg class="spark" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="Ventas por día de los últimos 14 días">' + vals.map(function (v, i) {
      var h = v > 0 ? Math.max(3, Math.round(v / max * H)) : 2;
      var t = s - (days - 1 - i) * DAY;
      return '<rect x="' + (i * (bw + g)).toFixed(1) + '" y="' + (H - h) + '" width="' + bw.toFixed(1) + '" height="' + h + '" rx="1.5"' + (i === days - 1 ? ' class="today"' : '') + '><title>' + esc(dayLabel(t)) + ': ' + money(v) + '</title></rect>';
    }).join('') + '</svg><div class="spark-cap">Últimos 14 días</div></div>';
  }
  function renderMetrics() {
    var inP = S.orders.filter(inPeriod), live = inP.filter(function (o) { return o.status !== 'anulado'; });
    var ventas = r2(live.reduce(function (a, o) { return a + (o.total || 0); }, 0));
    var anul = inP.length - live.length;
    var all = S.orders.filter(function (o) { return o.status !== 'anulado'; });
    var debt = all.filter(function (o) { return balance(o) > 0.004; });
    var cobrar = r2(debt.reduce(function (a, o) { return a + balance(o); }, 0));
    var desp = all.filter(function (o) { return o.status === 'nuevo' || o.status === 'empacado'; });
    var nNuevo = desp.filter(function (o) { return o.status === 'nuevo'; }).length;
    $('#metrics').innerHTML =
      '<div class="metric m-sales"><div class="eyebrow">Ventas · ' + PERIOD_TXT[S.period] + '</div><div class="m-row"><div class="v">' + money(ventas) + '</div>' + spark() + '</div><div class="s">' + (live.length ? 'Ticket promedio ' + money(ventas / live.length) : 'Sin ventas en este periodo') + '</div></div>' +
      '<div class="metric"><div class="eyebrow">Pedidos</div><div class="v num">' + live.length + '</div><div class="s">' + (anul ? anul + (anul === 1 ? ' anulado' : ' anulados') + ' aparte' : 'Sin anulaciones') + '</div></div>' +
      '<div class="metric m-cobrar"><div class="eyebrow">Por cobrar</div><div class="v' + (cobrar > 0 ? ' warn-t' : '') + '">' + money(cobrar) + '</div><div class="s">' + (debt.length ? debt.length + (debt.length === 1 ? ' pedido con saldo' : ' pedidos con saldo') + ' · total' : 'Todo cobrado') + '</div></div>' +
      '<div class="metric"><div class="eyebrow">Por despachar</div><div class="v num">' + desp.length + '</div><div class="s">' + (desp.length ? nNuevo + ' por empacar · ' + (desp.length - nNuevo) + ' listos' : 'Nada pendiente') + '</div></div>';
  }
  function payPill(o) {
    var p = o.payment || {};
    if (o.status === 'anulado') return '<span class="pill mute">' + esc(p.method || '—') + '</span>';
    var b = balance(o);
    if (b <= 0.004) return '<span class="pill ok">' + I.check.replace('class="i"', 'class="i" style="width:12px;height:12px"') + 'Pagado · ' + esc(p.collectedWith || p.method || '') + '</span>';
    return '<span class="pill warn">' + (p.status === 'contra' ? 'Cobrar ' : 'Saldo ') + money(b) + '</span>';
  }
  function stBlock(o) {
    var s = o.status || 'nuevo', step = STEPS.indexOf(s) + 1;
    return '<span class="st" data-s="' + esc(s) + '"><span class="st-bar">' + [1, 2, 3, 4].map(function (i) { return '<i class="' + (i <= step ? 'on' : '') + '"></i>'; }).join('') + '</span><span class="st-l">' + esc(stLabel(s, o.delivery && o.delivery.type)) + '</span></span>';
  }
  function filtered() {
    return S.orders.filter(function (o) { return inPeriod(o) && matchQ(o); });
  }
  function renderList() {
    var base = filtered();
    var counts = { todos: base.length };
    base.forEach(function (o) { counts[o.status] = (counts[o.status] || 0) + 1; });
    $('#stabs').innerHTML = STABS.map(function (t) {
      return '<button type="button" data-stab="' + t[0] + '" aria-pressed="' + (S.stab === t[0]) + '">' + t[1] + ' <span class="c">' + (counts[t[0]] || 0) + '</span></button>';
    }).join('');
    var list = S.stab === 'todos' ? base : base.filter(function (o) { return o.status === S.stab; });
    var box = $('#olist');
    if (!S.ready) { box.innerHTML = '<div class="empty big"><p>Cargando pedidos…</p></div>'; return; }
    if (!S.orders.length) {
      box.innerHTML = '<div class="empty big"><h3>Todavía no hay pedidos</h3><p>Cada pedido que registres aparece aquí con su estado de despacho y de pago.</p><div class="row"><button type="button" class="btn primary sm" data-view="nuevo">Registrar el primero</button></div></div>';
      return;
    }
    if (!list.length) {
      box.innerHTML = '<div class="empty big"><h3>Sin resultados</h3><p>Ningún pedido coincide con este filtro' + (S.period !== 'todo' ? ' en ' + PERIOD_TXT[S.period] : '') + '.</p>' + (S.period !== 'todo' ? '<div class="row"><button type="button" class="btn sm" data-period="todo">Ver todo el historial</button></div>' : '') + '</div>';
      return;
    }
    var html = '<div class="orow ohead" aria-hidden="true"><span>N°</span><span>Cliente</span><span>Entrega</span><span class="r">Total</span><span>Pago</span><span>Estado</span></div>';
    var lastDay = null;
    list.forEach(function (o) {
      var d = startOfDay(o.createdAt);
      if (d !== lastDay) {
        lastDay = d;
        var same = list.filter(function (x) { return startOfDay(x.createdAt) === d; });
        var sum = same.reduce(function (a, x) { return x.status !== 'anulado' ? a + (x.total || 0) : a; }, 0);
        var rel = relDay(d);
        html += '<div class="oday"><span>' + esc(cap(rel === 'hoy' || rel === 'ayer' ? rel + ' · ' + clean(dLong.format(d)) : clean(dLong.format(d)))) + '</span><span class="num">' + same.length + (same.length === 1 ? ' pedido' : ' pedidos') + ' · ' + money(sum) + '</span></div>';
      }
      var n = (o.items || []).reduce(function (a, i) { return a + (i.qty || 0); }, 0);
      var type = (o.delivery && o.delivery.type) || 'lima';
      html += '<button type="button" class="orow' + (o.status === 'anulado' ? ' is-x' : '') + '" data-act="open" data-id="' + esc(o.id) + '">' +
        '<span class="a-no"><span class="mono">' + esc(orderNo(o)) + '</span><span class="sub">' + esc(tShort.format(o.createdAt)) + (o.ejemplo ? ' · ejemplo' : '') + '</span></span>' +
        '<span class="a-cli"><span class="nm">' + esc(o.customer && o.customer.name) + '</span><span class="sub">' + esc(fmtPhone(o.customer && o.customer.phone)) + '</span></span>' +
        '<span class="a-ent"><span class="nm2">' + I[type] + '<span>' + esc(delivWhere(o)) + '</span></span><span class="sub">' + esc(cap(delivWhen(o))) + '</span></span>' +
        '<span class="a-tot"><span class="tot">' + money(o.total) + '</span><span class="sub">' + n + (n === 1 ? ' unidad' : ' unidades') + '</span></span>' +
        '<span class="a-pay">' + payPill(o) + '</span>' +
        '<span class="a-st">' + stBlock(o) + '</span></button>';
    });
    box.innerHTML = html;
  }

  /* ---------- drawer ---------- */
  var lastFocus = null;
  function openDrawer(id) {
    lastFocus = document.activeElement;
    S.openId = id; S.confirmDel = false;
    renderDrawer();
    $('#drawer').hidden = false; $('#scrim').hidden = false;
    document.body.style.overflow = 'hidden';
    var c = $('#drawer [data-act="close"]'); if (c) c.focus();
  }
  function closeDrawer() {
    if (!S.openId) return;
    S.openId = null; S.confirmDel = false;
    $('#drawer').hidden = true; $('#scrim').hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function renderDrawer() {
    var o = S.orders.find(function (x) { return x.id === S.openId; });
    var dr = $('#drawer');
    if (!o) { closeDrawer(); return; }
    var d = o.delivery || {}, p = o.payment || {}, c = o.customer || {};
    var s = o.status || 'nuevo', cur = STEPS.indexOf(s), x = s === 'anulado', b = balance(o);
    var last = (o.history || []).slice(-1)[0];
    var steps = '<div class="steps' + (x ? ' x' : '') + (s === 'entregado' ? ' fin' : '') + '">' + STEPS.map(function (k, i) {
      var cls = i < cur ? 'done' : i === cur ? 'cur' : '';
      return '<button type="button" class="step ' + cls + '" data-act="status" data-s="' + k + '"' + (S.canWrite && !x ? '' : ' disabled') + ' aria-pressed="' + (i === cur) + '"><i>' + I.check + '</i>' + esc(stLabel(k, d.type)) + '</button>';
    }).join('') + '</div>';
    var ent = '';
    if (d.type === 'provincia') ent = '<dt>Agencia</dt><dd>' + esc(d.agency) + '</dd><dt>Destino</dt><dd>' + esc(d.city) + '</dd><dt>DNI recoge</dt><dd class="mono">' + esc(d.recipientDoc) + '</dd>';
    else if (d.type === 'recojo') ent = '<dt>Modalidad</dt><dd>Recojo en tienda</dd>';
    else ent = '<dt>Distrito</dt><dd>' + esc(d.district) + '</dd><dt>Dirección</dt><dd>' + esc(d.address) + '</dd>' + (d.reference ? '<dt>Referencia</dt><dd>' + esc(d.reference) + '</dd>' : '');
    ent += '<dt>' + (d.type === 'recojo' ? 'Recoge' : d.type === 'provincia' ? 'Envío' : 'Entrega') + '</dt><dd>' + esc(d.date ? cap(fmtDate(d.date)) : 'Sin fecha') + (d.slot && d.type !== 'provincia' ? ' · ' + esc(d.slot) : '') + '</dd>';
    var payTxt = p.status === 'pagado' || b <= 0.004 ? '<span class="pill ok">Pagado</span>' : p.status === 'adelanto' ? '<span class="pill warn">Adelanto · saldo ' + money(b) + '</span>' : '<span class="pill warn">Contra entrega · ' + money(b) + '</span>';
    var collect = (!x && b > 0.004 && S.canWrite) ? '<div class="collect"><p>Registrar cobro del saldo de ' + money(b) + ' con:</p><div class="chips">' + METODOS.map(function (m) { return '<button type="button" class="chip" data-act="collect" data-m="' + m + '">' + m + '</button>'; }).join('') + '</div></div>' : '';
    var phone = digits(c.phone);
    var wa = phone.length === 9 ? 'https://wa.me/51' + phone : phone.length > 9 ? 'https://wa.me/' + phone : '';
    if (wa) wa += '?text=' + encodeURIComponent(summary(o));
    dr.innerHTML =
      '<div class="d-head"><div><div class="eyebrow">' + (o.ejemplo ? 'Pedido de ejemplo' : 'Pedido') + '</div><h2 class="d-no" id="d-title">N° ' + esc(orderNo(o)) + '</h2><div class="d-meta">Registrado ' + esc(when(o.createdAt)) + (o.updatedAt && o.updatedAt - o.createdAt > 60000 ? ' · actualizado ' + esc(when(o.updatedAt)) : '') + '</div></div><button type="button" class="icon-btn" data-act="close" aria-label="Cerrar">' + I.x + '</button></div>' +
      '<div class="d-body">' +
        '<section class="d-sec"><div class="d-sec-h"><span class="eyebrow">Despacho</span>' + (x ? '<span class="pill bad">Anulado</span>' : '') + '</div>' + steps +
          (last ? '<div class="d-hist">Último cambio: ' + esc(stLabel(last.s, d.type)) + ', ' + esc(when(last.at)) + '</div>' : '') + '</section>' +
        '<section class="d-sec"><div class="d-sec-h"><span class="eyebrow">Cliente</span></div><dl class="dl"><dt>Nombre</dt><dd><b>' + esc(c.name) + '</b></dd><dt>Celular</dt><dd><span class="inline"><span class="mono">' + esc(fmtPhone(phone)) + '</span><button type="button" class="link" data-act="copy-phone">Copiar</button></span></dd>' + (c.doc ? '<dt>DNI / RUC</dt><dd class="mono">' + esc(c.doc) + '</dd>' : '') + '</dl></section>' +
        '<section class="d-sec"><div class="d-sec-h"><span class="eyebrow">' + ({ provincia: 'Envío a provincia', recojo: 'Recojo en tienda' }[d.type] || 'Delivery Lima') + '</span></div><dl class="dl">' + ent + '</dl></section>' +
        '<section class="d-sec"><div class="d-sec-h"><span class="eyebrow">Productos</span></div><table class="d-items"><tbody>' + (o.items || []).map(function (i) {
          return '<tr><td class="q">' + esc(i.qty) + '×</td><td>' + esc(i.name) + (i.pres ? '<small>' + esc(i.pres) + ' · ' + money(i.price) + ' c/u</small>' : '<small>' + money(i.price) + ' c/u</small>') + '</td><td class="m">' + money(i.price * i.qty) + '</td></tr>';
        }).join('') + '</tbody></table><div class="d-tot"><div><span>Subtotal</span><span class="num">' + money(o.subtotal) + '</span></div>' + (o.shipping ? '<div><span>Envío</span><span class="num">' + money(o.shipping) + '</span></div>' : '') + (o.discount ? '<div><span>Descuento</span><span class="num">− ' + money(o.discount) + '</span></div>' : '') + '<div class="big"><span>Total</span><span class="num">' + money(o.total) + '</span></div></div></section>' +
        '<section class="d-sec"><div class="d-sec-h"><span class="eyebrow">Pago</span>' + payTxt + '</div><dl class="dl"><dt>Método</dt><dd>' + esc(p.method) + '</dd><dt>Pagado</dt><dd class="num">' + money(p.paid) + '</dd>' + (b > 0.004 ? '<dt>Saldo</dt><dd class="num"><b>' + money(b) + '</b></dd>' : '') + (p.op ? '<dt>N° operación</dt><dd class="mono">' + esc(p.op) + '</dd>' : '') + (p.collectedWith ? '<dt>Saldo cobrado</dt><dd>' + esc(p.collectedWith) + (p.collectedAt ? ', ' + esc(when(p.collectedAt)) : '') + '</dd>' : '') + '</dl>' + collect + '</section>' +
        (o.notes ? '<section class="d-sec"><div class="d-sec-h"><span class="eyebrow">Notas</span></div><p style="margin:0;white-space:pre-wrap">' + esc(o.notes) + '</p></section>' : '') +
        '<p class="d-meta" id="d-by" hidden></p>' +
      '</div>' +
      '<div class="d-foot">' + (S.confirmDel
        ? '<span class="ask">¿Eliminar el pedido N° ' + esc(orderNo(o)) + '? Esta acción no se puede deshacer.</span><span class="sp"></span><button type="button" class="btn sm" data-act="del-no">Cancelar</button><button type="button" class="btn sm danger" data-act="del-yes">Eliminar pedido</button>'
        : '<button type="button" class="btn sm primary" data-act="copy">' + I.copy + 'Copiar resumen</button>' + (wa ? '<a class="btn sm" href="' + esc(wa) + '" target="_blank" rel="noopener">' + I.chat + 'WhatsApp</a>' : '') +
          (S.canWrite ? '<button type="button" class="btn sm" data-act="edit">' + I.edit + 'Editar</button><span class="sp"></span>' + (x ? '<button type="button" class="btn sm ghost" data-act="status" data-s="nuevo">Reactivar</button>' : '<button type="button" class="btn sm ghost" data-act="status" data-s="anulado">Anular</button>') + '<button type="button" class="btn sm ghost danger-t" data-act="del-ask">Eliminar</button>' : '')) +
      '</div>';
    if (o.createdBy && S.user) {
      S.user.profiles([o.createdBy]).then(function (ps) {
        var el = $('#d-by'); if (!el || S.openId !== o.id) return;
        var pr = ps && ps[o.createdBy];
        el.textContent = 'Registrado por ' + ((pr && pr.name) || 'un miembro del equipo');
        el.hidden = false;
      });
    }
  }
  function saveOrder(o, mut, msg) {
    if (!S.canWrite) return;
    var b = strip(o); mut(b); b.updatedAt = Date.now();
    return store.setOrder(o.id, b).then(function () { if (msg) toast(msg); }).catch(writeErr);
  }
  function setStatus(o, s) {
    if (o.status === s) return;
    var b = balance(o);
    saveOrder(o, function (x) {
      x.status = s; x.history = (x.history || []).concat([{ s: s, at: Date.now() }]).slice(-24);
    }, s === 'entregado' && b > 0.004 ? 'Marcado como entregado. Falta cobrar ' + money(b) + '.' : 'N° ' + orderNo(o) + ': ' + stLabel(s, o.delivery && o.delivery.type).toLowerCase());
  }
  function collect(o, m) {
    saveOrder(o, function (x) { x.payment.paid = x.total; x.payment.status = 'pagado'; x.payment.collectedWith = m; x.payment.collectedAt = Date.now(); }, 'Cobro registrado: ' + money(balance(o)) + ' con ' + m + '.');
  }

  /* ---------- summary / copy / csv ---------- */
  function summary(o) {
    var L = [], d = o.delivery || {}, p = o.payment || {};
    L.push('*Nativé · Pedido N° ' + orderNo(o) + '*');
    L.push(o.customer.name + (o.customer.phone ? ' · ' + fmtPhone(o.customer.phone) : ''));
    L.push('');
    (o.items || []).forEach(function (i) { L.push('• ' + i.qty + ' × ' + i.name + (i.pres ? ' (' + i.pres + ')' : '') + ' — ' + money(i.price * i.qty)); });
    L.push('');
    if (o.shipping) L.push('Envío: ' + money(o.shipping));
    if (o.discount) L.push('Descuento: − ' + money(o.discount));
    L.push('*Total: ' + money(o.total) + '*');
    var b = balance(o);
    if (b <= 0.004) L.push('Pago: ' + (p.collectedWith || p.method) + ' · pagado');
    else if (p.status === 'adelanto') L.push('Pago: adelanto de ' + money(p.paid) + ' por ' + p.method + ' · saldo ' + money(b));
    else L.push('Pago: contra entrega · ' + money(b));
    if (d.type === 'provincia') L.push('Envío por ' + d.agency + ' a ' + d.city + ' · DNI ' + d.recipientDoc);
    else if (d.type === 'recojo') L.push('Recojo en tienda');
    else L.push('Entrega: ' + d.district + ' — ' + d.address + (d.reference ? ' (Ref.: ' + d.reference + ')' : ''));
    if (d.date) L.push('Fecha: ' + cap(fmtDate(d.date)) + (d.slot && d.type !== 'provincia' ? ' · ' + d.slot : ''));
    if (o.notes) L.push('Nota: ' + o.notes);
    return L.join('\n');
  }
  function copyText(t, okMsg) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; ta.style.top = '0';
      document.body.appendChild(ta); ta.select(); var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      toast(ok ? okMsg : 'Tu navegador no permitió copiar. Usa el botón de WhatsApp del pedido.');
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast(okMsg); }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }
  function exportCsv() {
    var rows = filtered().filter(function (o) { return S.stab === 'todos' || o.status === S.stab; });
    if (!rows.length) { toast('No hay pedidos en este filtro para exportar.'); return; }
    var q = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var head = ['N°', 'Fecha', 'Hora', 'Cliente', 'Celular', 'DNI/RUC', 'Entrega', 'Distrito / Destino', 'Dirección / Agencia', 'Fecha de entrega', 'Productos', 'Subtotal', 'Envío', 'Descuento', 'Total', 'Método', 'Estado de pago', 'Pagado', 'Saldo', 'Estado', 'Notas'];
    var lines = [head.map(q).join(',')].concat(rows.map(function (o) {
      var d = o.delivery || {}, p = o.payment || {};
      return [orderNo(o), isoLocal(o.createdAt), tShort.format(o.createdAt), o.customer.name, o.customer.phone, o.customer.doc, DELIV[d.type] || '', d.type === 'provincia' ? d.city : d.district, d.type === 'provincia' ? d.agency : d.address, d.date,
        (o.items || []).map(function (i) { return i.qty + ' x ' + i.name; }).join(' | '), r2(o.subtotal).toFixed(2), r2(o.shipping).toFixed(2), r2(o.discount).toFixed(2), r2(o.total).toFixed(2), p.method, PAYST[p.status] || '', r2(p.paid).toFixed(2), balance(o).toFixed(2), stLabel(o.status, d.type), o.notes].map(q).join(',');
    }));
    var csv = '\ufeff' + lines.join('\r\n');
    saveFile('pedidos-native-' + isoLocal() + '.csv', csv, 'text/csv;charset=utf-8');
  }
  function saveFile(name, content, type) {
    if (S.downloads) {
      return S.downloads.save({ filename: name, data: content }).then(function () { return true; }, function (e) { if (!e || e.code !== 'declined') toast('No se pudo preparar la descarga.'); return false; });
    }
    try {
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type: type })); a.download = name;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
      return Promise.resolve(true);
    } catch (e) { toast('No se pudo preparar la descarga.'); return Promise.resolve(false); }
  }
  function backupSave() {
    if (!store || !store.exportAll) return;
    var d = store.exportAll();
    var no = Object.keys(d.orders).length, np = Object.keys(d.products).length;
    var payload = { app: 'native-pedidos', version: 1, exportedAt: new Date().toISOString(), orders: d.orders, products: d.products };
    saveFile('respaldo-native-' + isoLocal() + '.json', JSON.stringify(payload), 'application/json').then(function (ok) {
      if (!ok) return;
      lsSet(LS_BK, Date.now()); renderBackup();
      toast('Respaldo descargado: ' + no + (no === 1 ? ' pedido' : ' pedidos') + ' y ' + np + (np === 1 ? ' producto.' : ' productos.'));
    });
  }
  function backupLoad(file) {
    if (!file || !store || !store.importAll) return;
    var rd = new FileReader();
    rd.onload = function () {
      var inc = null;
      try { inc = JSON.parse(rd.result); } catch (e) { inc = null; }
      if (!inc || inc.app !== 'native-pedidos' || !inc.orders || typeof inc.orders !== 'object' || !inc.products || typeof inc.products !== 'object') {
        toast('Ese archivo no es un respaldo de Nativé Pedidos. Elige el .json que descargaste con «Descargar respaldo».');
        return;
      }
      var n = store.importAll(inc);
      toast(n.orders || n.products ? 'Respaldo restaurado: ' + n.orders + (n.orders === 1 ? ' pedido' : ' pedidos') + ' y ' + n.products + (n.products === 1 ? ' producto' : ' productos') + ' actualizados.' : 'Tu información ya estaba al día con ese respaldo.');
    };
    rd.onerror = function () { toast('No se pudo leer el archivo. Inténtalo de nuevo.'); };
    rd.readAsText(file);
  }

  /* ---------- catálogo ---------- */
  function renderCatalog() {
    var box = $('#ctable');
    $('#cat-save').disabled = !S.canWrite;
    if (!S.ready) { box.innerHTML = '<div class="empty big"><p>Cargando catálogo…</p></div>'; return; }
    if (!S.products.length) {
      box.innerHTML = '<div class="empty big"><h3>Tu catálogo está vacío</h3><p>Agrega cada producto con su presentación y precio. Aparecerán como accesos rápidos al registrar pedidos.</p>' + (S.canWrite ? '<div class="row"><button type="button" class="btn sm" data-act="load-ex">Cargar productos de ejemplo</button></div>' : '') + '</div>';
      return;
    }
    var from = startOfDay() - 29 * DAY, sold = {};
    S.orders.forEach(function (o) { if (o.status !== 'anulado' && o.createdAt >= from) (o.items || []).forEach(function (i) { if (i.pid) sold[i.pid] = (sold[i.pid] || 0) + (i.qty || 0); }); });
    box.innerHTML = '<div class="crow ohead" aria-hidden="true"><span>Producto</span><span>Presentación</span><span class="r">Precio</span><span class="r">Vendidos 30 d</span><span>Activo</span><span></span></div>' + S.products.map(function (p) {
      var on = p.active !== false;
      var acts = !S.canWrite ? '' : S.catDel === p.id
        ? '<span class="muted" style="font-size:12.5px">¿Eliminar?</span><button type="button" class="btn sm" data-act="cat-del-no">No</button><button type="button" class="btn sm danger" data-act="cat-del-yes" data-id="' + esc(p.id) + '">Sí</button>'
        : '<button type="button" class="btn sm ghost" data-act="cat-edit" data-id="' + esc(p.id) + '">Editar</button><button type="button" class="btn sm ghost danger-t" data-act="cat-del-ask" data-id="' + esc(p.id) + '">Eliminar</button>';
      return '<div class="crow' + (on ? '' : ' off') + '"><span class="c-nm nm">' + esc(p.name) + (p.ejemplo ? '<span class="pill ex">Ejemplo</span>' : '') + '</span><span class="c-pres">' + esc(p.pres || '—') + '</span><span class="c-pr pr r num">' + money(p.price) + '</span><span class="c-sold r num">' + (sold[p.id] || 0) + '<span class="cat-u"> u.</span></span><span class="c-sw"><button type="button" class="sw" data-act="cat-toggle" data-id="' + esc(p.id) + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Pausar ' : 'Activar ') + esc(p.name) + '"' + (S.canWrite ? '' : ' disabled') + '></button></span><span class="acts">' + acts + '</span></div>';
    }).join('');
  }
  function catReset() {
    S.catEdit = null; $('#c-name').value = ''; $('#c-pres').value = ''; $('#c-price').value = '';
    $('#cat-save').textContent = 'Agregar'; $('#cat-cancel').hidden = true; $('#c-name-l').textContent = 'Nuevo producto';
  }
  function catSave() {
    if (!S.canWrite) return;
    var name = $('#c-name').value.trim(), pres = $('#c-pres').value.trim(), price = r2(num($('#c-price').value));
    if (!name) { toast('Escribe el nombre del producto.'); $('#c-name').focus(); return; }
    if (!(price > 0)) { toast('Indica un precio mayor a cero.'); $('#c-price').focus(); return; }
    var ex = S.catEdit && S.products.find(function (p) { return p.id === S.catEdit; });
    var body = ex ? Object.assign(strip(ex), { name: name, pres: pres, price: price, ejemplo: false, updatedAt: Date.now() }) : { name: name, pres: pres, price: price, active: true, ejemplo: false, createdAt: Date.now() };
    store.setProduct(ex ? ex.id : uid('p'), body).then(function () { toast(ex ? 'Producto actualizado.' : name + ' agregado al catálogo.'); catReset(); $('#c-name').focus(); }).catch(writeErr);
  }
  function loadExamples() {
    if (!S.canWrite) return;
    var ex = exampleData(Date.now());
    var chain = Promise.resolve();
    var hasProducts = S.products.length > 0;
    if (!hasProducts) ex.products.forEach(function (p) { chain = chain.then(function () { return store.setProduct(p.id, strip(p)); }); });
    if (!S.orders.length) ex.orders.forEach(function (o) { chain = chain.then(function () { return store.setOrder(o.id, strip(o)); }); });
    chain.then(function () { toast('Datos de ejemplo cargados.'); }).catch(writeErr);
  }
  function deleteExamples() {
    var os = S.orders.filter(function (o) { return o.ejemplo; }), ps = S.products.filter(function (p) { return p.ejemplo; });
    var chain = Promise.resolve();
    os.forEach(function (o) { chain = chain.then(function () { return store.deleteOrder(o.id); }); });
    ps.forEach(function (p) { chain = chain.then(function () { return store.deleteProduct(p.id); }); });
    S.confirmEx = false;
    chain.then(function () { toast('Ejemplos borrados. Todo listo para tus pedidos reales.'); S.form.items = S.form.items.filter(function (i) { return !i.pid || S.products.some(function (p) { return p.id === i.pid; }); }); renderLines(); renderTicket(); }).catch(writeErr);
  }

  /* ---------- views ---------- */
  function setView(v) {
    if (['nuevo', 'pedidos', 'catalogo'].indexOf(v) < 0) v = 'nuevo';
    var changed = S.view !== v;
    S.view = v;
    $$('.view').forEach(function (s) { s.hidden = s.id !== 'v-' + v; });
    $$('.tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.view === v)); });
    document.body.dataset.screen = v;
    try { history.replaceState(null, '', '#' + v); } catch (e) {}
    if (v === 'pedidos') renderPedidos();
    if (v === 'catalogo') renderCatalog();
    if (changed) window.scrollTo(0, 0);
  }

  /* ---------- toasts ---------- */
  function toast(msg, actions) {
    actions = actions || [];
    var box = $('#toasts');
    while (box.children.length > 2) box.firstChild.remove();
    var el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
    var m = document.createElement('span'); m.textContent = msg; el.appendChild(m);
    actions.forEach(function (a) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = a.label;
      b.addEventListener('click', function () { a.fn(); el.remove(); });
      el.appendChild(b);
    });
    box.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 260); }, actions.length ? 8000 : 4200);
  }

  /* ---------- events ---------- */
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.f) {
      S.form[t.dataset.f] = t.value;
      if (t.getAttribute('aria-invalid')) { t.removeAttribute('aria-invalid'); var er = $('#e-' + t.id.slice(2)); if (er) er.hidden = true; }
      if (t.dataset.f === 'phone') {
        var m = lookupCustomer();
        if (m && m !== S.match) {
          if (!S.form.name.trim()) { S.form.name = m.name; $('#f-name').value = m.name; }
          if (!S.form.doc.trim() && m.doc) { S.form.doc = m.doc; $('#f-doc').value = m.doc; }
        }
        S.match = m; renderMatch();
      }
      if (t.dataset.f === 'address') renderMatch();
      renderTicket(); saveDraft();
      return;
    }
    if (t.dataset && t.dataset.li) {
      var row = t.closest('.line'); var it = row && S.form.items.find(function (i) { return i.key === row.dataset.key; });
      if (!it) return;
      it[t.dataset.li] = t.value;
      if (t.dataset.li === 'qty') renderPicks();
      updateLine(it.key); renderTicket(); saveDraft();
      return;
    }
    if (t.id === 'p-q') { S.pq = t.value; renderPicks(); return; }
    if (t.id === 'o-q') { S.oq = t.value; renderList(); return; }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.tagName === 'SELECT' && t.dataset.f && S.form[t.dataset.f] !== t.value) { S.form[t.dataset.f] = t.value; renderTicket(); saveDraft(); return; }
    if (t.dataset && t.dataset.li === 'qty') {
      var row = t.closest('.line'); var it = row && S.form.items.find(function (i) { return i.key === row.dataset.key; });
      if (it) { it.qty = Math.max(1, Math.round(num(it.qty)) || 1); t.value = it.qty; updateLine(it.key); renderTicket(); renderPicks(); }
    }
    if (t.dataset && t.dataset.li === 'price') {
      var row2 = t.closest('.line'); var it2 = row2 && S.form.items.find(function (i) { return i.key === row2.dataset.key; });
      if (it2 && t.value !== '') { it2.price = r2(num(it2.price)).toFixed(2); t.value = it2.price; }
    }
    if (t.id === 'f-phone' && digits(t.value).length === 9) { t.value = fmtPhone(t.value); S.form.phone = t.value; }
    if (t.id === 'bk-file') { backupLoad(t.files && t.files[0]); t.value = ''; }
  });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { if (S.view === 'nuevo' && !S.openId) { e.preventDefault(); submit(); } return; }
    if (e.key === 'Escape') {
      if (S.openId) { closeDrawer(); return; }
      if (e.target.id === 'p-q' && S.pq) { S.pq = ''; e.target.value = ''; renderPicks(); return; }
    }
    if (e.key === '/' && !typing && !S.openId) { e.preventDefault(); setView('nuevo'); $('#p-q').focus(); return; }
    if (e.key === 'Enter' && e.target.id === 'p-q') {
      e.preventDefault();
      var q = norm(S.pq); if (!q) return;
      var p = S.products.find(function (x) { return x.active !== false && norm(x.name + ' ' + (x.pres || '')).indexOf(q) > -1; });
      if (p) addItem(p); else addFree(S.pq.trim());
      S.pq = ''; e.target.value = ''; renderPicks();
      if (p) e.target.focus();
      return;
    }
    if (e.key === 'Enter' && ['c-name', 'c-pres', 'c-price'].indexOf(e.target.id) > -1) { e.preventDefault(); catSave(); return; }
    if (e.key === 'Tab' && S.openId) {
      var f = $$('#drawer button:not([disabled]), #drawer a[href]'); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    var v = t.closest('[data-view]'); if (v) { closeDrawer(); setView(v.dataset.view); return; }
    var sg = t.closest('[data-seg]');
    if (sg) { S.form[sg.dataset.seg] = sg.dataset.v; syncSegs(); renderTicket(); saveDraft(); return; }
    var pr = t.closest('[data-period]');
    if (pr) { S.period = pr.dataset.period; lsSet(LS_PREF, { period: S.period }); renderPedidos(); return; }
    var st = t.closest('[data-stab]');
    if (st) { S.stab = st.dataset.stab; renderList(); return; }
    var a = t.closest('[data-act]'); if (!a) return;
    var act = a.dataset.act, o = S.openId && S.orders.find(function (x) { return x.id === S.openId; });
    var row = a.closest('.line'), it = row && S.form.items.find(function (i) { return i.key === row.dataset.key; });
    switch (act) {
      case 'pick': var p = S.products.find(function (x) { return x.id === a.dataset.id; }); if (p) addItem(p); break;
      case 'free': addFree(''); break;
      case 'free-q': addFree(S.pq.trim()); S.pq = ''; $('#p-q').value = ''; renderPicks(); break;
      case 'inc': if (it) { it.qty = Math.max(1, Math.round(num(it.qty))) + 1; updateLine(it.key); renderTicket(); renderPicks(); saveDraft(); } break;
      case 'dec':
        if (it) {
          var q = Math.max(1, Math.round(num(it.qty))) - 1;
          if (q < 1) { S.form.items = S.form.items.filter(function (i) { return i !== it; }); renderLines(); }
          else { it.qty = q; updateLine(it.key); }
          renderTicket(); renderPicks(); saveDraft();
        }
        break;
      case 'rm': if (it) { S.form.items = S.form.items.filter(function (i) { return i !== it; }); renderLines(); renderTicket(); renderPicks(); saveDraft(); } break;
      case 'submit': submit(); break;
      case 'reset': resetForm(); break;
      case 'edit-cancel': resetForm(); toast('Edición cancelada. El pedido quedó como estaba.'); break;
      case 'use-addr':
        var ld = S.match && S.match.lastDelivery;
        if (ld) { S.form.deliveryType = 'lima'; S.form.district = ld.district || ''; S.form.address = ld.address || ''; S.form.reference = ld.reference || ''; ['district', 'address', 'reference'].forEach(function (k) { $('#f-' + k).value = S.form[k]; }); syncSegs(); renderMatch(); renderTicket(); saveDraft(); }
        break;
      case 'open': openDrawer(a.dataset.id); break;
      case 'close': closeDrawer(); break;
      case 'status': if (o) setStatus(o, a.dataset.s); break;
      case 'collect': if (o) collect(o, a.dataset.m); break;
      case 'copy': if (o) copyText(summary(o), 'Resumen copiado. Pégalo en WhatsApp.'); break;
      case 'copy-phone': if (o) copyText(digits(o.customer.phone), 'Celular copiado.'); break;
      case 'edit': if (o) loadForEdit(o); break;
      case 'del-ask': S.confirmDel = true; renderDrawer(); break;
      case 'del-no': S.confirmDel = false; renderDrawer(); break;
      case 'del-yes':
        if (o) { var no = orderNo(o); store.deleteOrder(o.id).then(function () { toast('Pedido N° ' + no + ' eliminado.'); }).catch(writeErr); closeDrawer(); if (S.editingId === o.id) resetForm(true); }
        break;
      case 'csv': exportCsv(); break;
      case 'bk-save': backupSave(); break;
      case 'bk-load': $('#bk-file').click(); break;
      case 'ex-ask': S.confirmEx = true; renderBanner(); break;
      case 'ex-no': S.confirmEx = false; renderBanner(); break;
      case 'ex-yes': deleteExamples(); break;
      case 'load-ex': loadExamples(); break;
      case 'cat-save': catSave(); break;
      case 'cat-cancel': catReset(); break;
      case 'cat-edit':
        var cp = S.products.find(function (x) { return x.id === a.dataset.id; });
        if (cp) { S.catEdit = cp.id; $('#c-name').value = cp.name; $('#c-pres').value = cp.pres || ''; $('#c-price').value = r2(cp.price).toFixed(2); $('#cat-save').textContent = 'Guardar cambios'; $('#cat-cancel').hidden = false; $('#c-name-l').textContent = 'Editando producto'; $('#c-name').focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        break;
      case 'cat-toggle':
        var tp = S.products.find(function (x) { return x.id === a.dataset.id; });
        if (tp && S.canWrite) { var tb = strip(tp); tb.active = tp.active === false; store.setProduct(tp.id, tb).catch(writeErr); }
        break;
      case 'cat-del-ask': S.catDel = a.dataset.id; renderCatalog(); break;
      case 'cat-del-no': S.catDel = null; renderCatalog(); break;
      case 'cat-del-yes':
        var dp = S.products.find(function (x) { return x.id === a.dataset.id; });
        S.catDel = null;
        if (dp) store.deleteProduct(dp.id).then(function () { toast(dp.name + ' eliminado del catálogo.'); if (S.catEdit === dp.id) catReset(); }).catch(writeErr);
        break;
    }
  });

  /* ---------- boot ---------- */
  buildStatic();
  var draft = lsGet(LS_DRAFT);
  if (draft && typeof draft === 'object' && Array.isArray(draft.items)) {
    S.form = Object.assign(blankForm(), draft);
    S.form.items = draft.items.filter(function (i) { return i && i.key; });
  }
  fillForm();
  var hash = (location.hash || '').replace('#', '');
  setView(hash || 'nuevo');
  renderPerm();

  function startLocal() {
    store = localStore();
    setSync(store.mode);
    store.start(onData);
  }
  if (S.inViewer) {
    setSync('connecting');
    Promise.all([
      window.claude.use('db').catch(function () { return null; }),
      window.claude.use('user').catch(function () { return null; }),
      window.claude.use('downloads').catch(function () { return null; })
    ]).then(function (r) {
      var db = r[0], user = r[1];
      S.downloads = r[2];
      if (S.view === 'pedidos') renderPedidos();
      if (user) {
        S.user = user;
        user.id().then(function (id) { S.meId = id; });
        user.can('data.write').then(function (w) { if (w === false) { S.canWrite = false; renderPerm(); renderAll(); } });
      }
      if (db) { store = dbStore(db); setSync('db'); store.start(onData); }
      else startLocal();
    });
  } else {
    startLocal();
  }
})();
