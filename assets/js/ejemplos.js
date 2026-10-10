/* Nativé Pedidos · datos de ejemplo (solo se cargan si pulsas «Cargar ejemplos») */
function exampleData(now) {
  now = now || Date.now();
  var DAY = 864e5;
  var d0 = new Date(now); d0.setHours(0, 0, 0, 0);
  var s0 = d0.getTime();
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  var iso = function (t) { var d = new Date(t); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
  var P = [
    ['ex-maca', 'Maca negra gelatinizada', 'Bolsa 500 g', 45],
    ['ex-moringa', 'Moringa en cápsulas', 'Frasco 100 cáps.', 38],
    ['ex-curcuma', 'Cúrcuma con pimienta negra', 'Frasco 90 cáps.', 42],
    ['ex-sacha', 'Aceite de sacha inchi', 'Botella 250 ml', 32],
    ['ex-camu', 'Camu camu en polvo', 'Doypack 250 g', 36],
    ['ex-una', 'Uña de gato', 'Frasco 100 cáps.', 30],
    ['ex-colageno', 'Colágeno hidrolizado con maca', 'Pote 400 g', 69],
    ['ex-kion', 'Jarabe de kion y propóleo', 'Frasco 250 ml', 28]
  ];
  var products = P.map(function (p, i) {
    return { id: p[0], name: p[1], pres: p[2], price: p[3], active: true, ejemplo: true, createdAt: now - (P.length - i) * 1000 };
  });
  var pr = {}; products.forEach(function (p) { pr[p.id] = p; });
  var spec = [
    { n: 1, t: [3, 11, 5], name: 'Andrea Flores', phone: '900000001', items: [['ex-una', 2]], d: { type: 'provincia', agency: 'Olva Courier', city: 'Trujillo', recipientDoc: '40000001' }, dd: 0, ship: 15, disc: 0, pay: ['Yape', 'adelanto', 20], st: 'anulado', notes: 'La clienta canceló antes del envío.' },
    { n: 2, t: [2, 10, 15], name: 'Lucía Paredes', phone: '900000002', items: [['ex-maca', 2], ['ex-camu', 1]], d: { type: 'lima', district: 'Miraflores', address: 'Av. José Pardo 610, dpto. 302', reference: 'Frente a la iglesia' }, dd: 0, slot: '13–18 h', ship: 10, disc: 0, pay: ['Yape', 'pagado'], op: '84512367', st: 'entregado' },
    { n: 3, t: [1, 16, 40], name: 'Carlos Quispe', phone: '900000003', items: [['ex-colageno', 1], ['ex-curcuma', 1]], d: { type: 'provincia', agency: 'Shalom', city: 'Arequipa', recipientDoc: '40000003' }, dd: 0, ship: 15, disc: 0, pay: ['Transferencia', 'pagado'], op: '00291844', st: 'enruta' },
    { n: 4, t: [1, 19, 5], name: 'Rosa Huamán', phone: '900000004', items: [['ex-moringa', 1], ['ex-sacha', 1]], d: { type: 'recojo' }, dd: 1, slot: '18–21 h', ship: 0, disc: 0, pay: ['Efectivo', 'pagado'], st: 'entregado' },
    { n: 5, t: [0, 9, 20], name: 'Diego Salazar', phone: '900000005', items: [['ex-maca', 3], ['ex-kion', 1]], d: { type: 'lima', district: 'Santiago de Surco', address: 'Jr. Monte Rosa 255', reference: 'Edificio gris, dejar en portería' }, dd: 1, slot: '9–13 h', ship: 10, disc: 13, pay: ['Efectivo', 'contra'], st: 'empacado', notes: 'Llamar antes de llegar.' },
    { n: 6, t: [0, 12, 48], name: 'Valeria Chávez', phone: '900000006', items: [['ex-curcuma', 2]], d: { type: 'lima', district: 'San Borja', address: 'Av. San Luis 2180' }, dd: 1, slot: '13–18 h', ship: 10, disc: 0, pay: ['Plin', 'pagado'], st: 'nuevo' },
    { n: 7, t: [0, 17, 32], name: 'Martín Rojas', phone: '900000007', items: [['ex-colageno', 1], ['ex-maca', 1]], d: { type: 'lima', district: 'Los Olivos', address: 'Calle Las Gardenias 148' }, dd: 1, slot: '18–21 h', ship: 12, disc: 0, pay: ['Yape', 'adelanto', 50], st: 'nuevo', notes: 'Es para regalo: incluir tarjeta.' }
  ];
  var STEPS = ['nuevo', 'empacado', 'enruta', 'entregado'];
  var orders = spec.map(function (x, i) {
    var createdAt = Math.min(s0 - x.t[0] * DAY + (x.t[1] * 60 + x.t[2]) * 6e4, now - (spec.length - i) * 9 * 6e4);
    var items = x.items.map(function (a) { var p = pr[a[0]]; return { pid: p.id, name: p.name, pres: p.pres, price: p.price, qty: a[1] }; });
    var subtotal = items.reduce(function (a, it) { return a + it.price * it.qty; }, 0);
    var total = Math.round((subtotal + x.ship - x.disc) * 100) / 100;
    var paid = x.pay[1] === 'pagado' ? total : (x.pay[1] === 'adelanto' ? x.pay[2] : 0);
    var history = x.st === 'anulado'
      ? [{ s: 'nuevo', at: createdAt }, { s: 'anulado', at: Math.min(createdAt + 5400000, now - 6e4) }]
      : STEPS.slice(0, STEPS.indexOf(x.st) + 1).map(function (s, k) { return { s: s, at: Math.min(createdAt + k * 3 * 3600000, now - (4 - k) * 6e4) }; });
    var delivery = { type: 'lima', district: '', address: '', reference: '', agency: '', city: '', recipientDoc: '', date: iso(createdAt + x.dd * DAY), slot: x.slot || '' };
    Object.keys(x.d).forEach(function (k) { delivery[k] = x.d[k]; });
    return {
      id: 'ex-o' + x.n, num: x.n, ejemplo: true, createdAt: createdAt, updatedAt: createdAt, createdBy: null,
      customer: { name: x.name, phone: x.phone, doc: '' },
      delivery: delivery, items: items, subtotal: subtotal, shipping: x.ship, discount: x.disc, total: total,
      payment: { method: x.pay[0], status: x.pay[1], paid: paid, op: x.op || '' },
      status: x.st, history: history, notes: x.notes || ''
    };
  });
  return { products: products, orders: orders };
}
