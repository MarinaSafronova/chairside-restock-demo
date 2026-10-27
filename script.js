const editButton = document.querySelector('#editOrder');
const editBar = document.querySelector('#editBar');
const cancelEditButton = document.querySelector('#cancelEdit');
const saveEditButton = document.querySelector('#saveEdit');
const orderLines = [...document.querySelectorAll('.order-line')];
const reviewPage = document.querySelector('#reviewPage');
const sentPage = document.querySelector('#sentPage');
const sendButton = document.querySelector('#sendOrder');
const sendButtonLabel = document.querySelector('#sendButtonLabel');
const notNowButton = document.querySelector('#notNow');
const backToSentButton = document.querySelector('#backToSent');
const replayDemoButton = document.querySelector('#replayDemo');
const sentSupplierList = document.querySelector('#sentSupplierList');
const sentDecisionCopy = document.querySelector('#sentDecisionCopy');
const sentDecisionChoice = document.querySelector('#sentDecisionChoice');
const toast = document.querySelector('#toast');
const toastCloseButton = toast.querySelector('button');
const alternativeButton = document.querySelector('.alternative-button');
const alternativePanel = document.querySelector('.alternative-panel');
const useAlternativeButton = document.querySelector('.use-alternative');
const keepCurrentButton = document.querySelector('.keep-current');
const warningLine = document.querySelector('.order-line--warning');
const attentionPill = document.querySelector('#attentionPill');
const decisionCount = document.querySelector('#decisionCount');
const summaryState = document.querySelector('.summary-heading > div > span');
const safetyCopy = document.querySelector('.safety-copy');
const orderStatus = document.querySelector('#orderStatus');
const reviewMetric = document.querySelector('#reviewMetric');
const reviewMetricLabel = document.querySelector('#reviewMetricLabel');
const headingCopy = document.querySelector('#headingCopy');
const viewOrderDetailsButton = document.querySelector('#viewOrderDetails');
const comparisonScope = document.querySelector('.landed-cost-title small');

const receiptIndex = document.querySelector('#receiptIndex');
const receiptTitle = document.querySelector('#receipt-title');
const receiptSummary = document.querySelector('#receiptSummary');
const receiptMath = document.querySelector('#receiptMath');
const comparisonTable = document.querySelector('#comparisonTable');
const receiptVerdict = document.querySelector('#receiptVerdict');

const supplierTotals = {
  'Dental Essentials': document.querySelector('[data-supplier-total="Dental Essentials"]'),
  'Henry Schein': document.querySelector('[data-supplier-total="Henry Schein"]'),
  MediDent: document.querySelector('[data-supplier-total="MediDent"]'),
};

const decisionData = {
  gloves: {
    index: '1 of 5',
    title: '12 boxes from Dental Essentials',
    summary:
      'Your recent use points to 11.4 boxes before the next planned restock. I rounded up once to avoid a mid-week top-up.',
    math: '<strong>3.8 / week</strong><i>×</i><strong>3 weeks</strong><i>=</i><strong>11.4</strong><b>→ 12 boxes</b>',
    comparisons: [
      { supplier: 'Dental Essentials', cost: 'A$186.00', state: 'chosen', label: 'chosen' },
      { supplier: 'MediDent', cost: 'A$194.40' },
      { supplier: 'Henry Schein', cost: 'A$201.80' },
    ],
    verdict:
      'Dental Essentials is A$8.40 cheaper after delivery, with no change to the product you usually buy.',
  },
  composite: {
    index: '2 of 5',
    title: '4 packs from Henry Schein',
    summary:
      'DentalCart lists four packs for A$268.00, but separate delivery adds A$18.00. Henry Schein ships them with anaesthetic for A$276.00, saving A$10.00 overall.',
    math: '<strong>0.9 / week</strong><i>×</i><strong>4 weeks</strong><i>=</i><strong>3.6</strong><b>→ 4 packs</b>',
    comparisons: [
      { supplier: 'Henry Schein', cost: 'A$276.00', state: 'chosen', label: 'grouped' },
      { supplier: 'DentalCart', cost: 'A$286.00' },
      { supplier: 'MediDent', cost: 'A$298.00' },
    ],
    verdict:
      'Henry Schein does not have the lowest item price. It is A$10 cheaper overall once delivery is included.',
  },
  anaesthetic: {
    index: '3 of 5',
    title: 'A familiar product, but a changed price',
    summary:
      'The usual brand is still available, but its price moved outside Harbour Dental’s normal range. This needs a person, not an automatic substitution.',
    math: '<strong>1.4 / week</strong><i>×</i><strong>3.5 weeks</strong><i>=</i><strong>4.9</strong><b>→ 5 boxes</b>',
    comparisons: [
      { supplier: 'Usual brand', cost: 'A$247.50', state: 'warning', label: '+17%' },
      { supplier: 'Possible alternative', cost: 'A$216.00' },
      { supplier: 'Last order', cost: 'A$211.50' },
    ],
    verdict:
      'Henry Schein has the lowest current quote for the familiar brand. I kept it in the draft and surfaced a possible alternative for the clinic to review.',
  },
  bibs: {
    index: '4 of 5',
    title: '8 packs from MediDent',
    summary:
      'Usage has been steady for six weeks, so the assistant kept your normal monthly quantity instead of adding precautionary stock.',
    math: '<strong>1.8 / week</strong><i>×</i><strong>4 weeks</strong><i>=</i><strong>7.2</strong><b>→ 8 packs</b>',
    comparisons: [
      { supplier: 'MediDent', cost: 'A$103.20', state: 'chosen', label: 'chosen' },
      { supplier: 'Dental Essentials', cost: 'A$109.60' },
      { supplier: 'Henry Schein', cost: 'A$116.00' },
    ],
    verdict:
      'MediDent has the lowest price after delivery for these exact bibs and already has another item in this order.',
  },
  tips: {
    index: '5 of 5',
    title: '6 larger bags from MediDent',
    summary:
      'A 250-tip bag is larger than your previous pack, but the quantity still maps to four weeks of use and reduces cost per tip.',
    math: '<strong>360 / week</strong><i>×</i><strong>4 weeks</strong><i>=</i><strong>1,440</strong><b>→ 6 × 250</b>',
    comparisons: [
      { supplier: 'MediDent · 250', cost: '5.9¢ / tip', state: 'chosen', label: 'chosen' },
      { supplier: 'Usual · 100', cost: '6.6¢ / tip' },
      { supplier: 'DentalCart · 100', cost: '7.1¢ / tip' },
    ],
    verdict:
      'The larger pack cuts the price per tip by about 10% while keeping roughly four weeks of stock.',
  },
};

let savedQuantities = orderLines.map((line) =>
  Number(line.querySelector('[data-quantity]').textContent),
);
const suggestedQuantities = Object.fromEntries(
  orderLines.map((line) => [line.dataset.decisionKey, Number(line.querySelector('[data-quantity]').textContent)]),
);
const suggestedReasons = Object.fromEntries(
  orderLines.map((line) => [line.dataset.decisionKey, line.querySelector('.reason-list > span').textContent.trim()]),
);
let decisionResolved = false;
let alternativeChosen = false;
let isEditing = false;
let selectedDecision = 'gloves';
let toastTimer;

function formatMoney(value) {
  return value.toLocaleString('en-AU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function updateTotals() {
  const totals = {
    'Dental Essentials': 0,
    'Henry Schein': 0,
    MediDent: 0,
  };

  orderLines.forEach((line) => {
    const quantity = Number(line.querySelector('[data-quantity]').textContent);
    const unitPrice = Number(line.dataset.unitPrice);
    const supplier = line.querySelector('.supplier-cell strong').textContent.trim();
    const lineTotal = quantity * unitPrice;

    line.querySelector('.line-price').textContent = `A$${formatMoney(lineTotal)}`;
    totals[supplier] += lineTotal;
  });

  const grandTotal = Object.values(totals).reduce((sum, total) => sum + total, 0);

  Object.entries(totals).forEach(([supplier, total]) => {
    supplierTotals[supplier].textContent = formatMoney(total);
  });

  ['orderTotal', 'itemsTotal', 'grandTotal'].forEach((id) => {
    document.querySelector(`#${id}`).textContent = formatMoney(grandTotal);
  });

  const anaestheticQuantity = Number(warningLine.querySelector('[data-quantity]').textContent);
  useAlternativeButton.textContent = `Use alternative · save A$${formatMoney(anaestheticQuantity * 6.3)}`;
}

function renderComparison(rows) {
  comparisonTable.replaceChildren();

  rows.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'comparison-row';

    if (item.state) row.classList.add(`comparison-row--${item.state}`);

    const supplier = document.createElement('span');
    supplier.textContent = item.supplier;

    if (item.label) {
      const label = document.createElement('em');
      label.textContent = item.label;
      supplier.append(label);
    }

    const cost = document.createElement('strong');
    cost.textContent = item.cost;
    row.append(supplier, cost);
    comparisonTable.append(row);
  });
}

function getDecision(key) {
  if (key !== 'anaesthetic') return decisionData[key];

  const quantity = Number(warningLine.querySelector('[data-quantity]').textContent);
  const usualCost = `A$${formatMoney(quantity * 49.5)}`;
  const otherUsualCost = `A$${formatMoney(quantity * 52)}`;
  const alternativeCost = `A$${formatMoney(quantity * 43.2)}`;
  const otherAlternativeCost = `A$${formatMoney(quantity * 46)}`;
  const previousCost = `A$${formatMoney(quantity * 42.3)}`;
  const difference = `A$${formatMoney(quantity * 6.3)}`;

  if (!decisionResolved) {
    return {
      ...decisionData.anaesthetic,
      comparisons: [
        { supplier: 'Usual brand · Henry Schein', cost: usualCost, state: 'warning', label: '+17%' },
        { supplier: 'Usual brand · MediDent', cost: otherUsualCost },
        { supplier: 'Alternative · Henry Schein', cost: alternativeCost },
        { supplier: 'Last order · same quantity', cost: previousCost },
      ],
    };
  }

  return {
    ...decisionData.anaesthetic,
    title: alternativeChosen
      ? `${quantity} alternative boxes from Henry Schein`
      : `${quantity} familiar-brand boxes from Henry Schein`,
    summary: alternativeChosen
      ? `You chose the alternative after review. The supplier stays the same while this line falls by ${difference}.`
      : 'You chose continuity with the familiar brand despite the price movement. The assistant recorded the exception instead of overriding it.',
    comparisons: alternativeChosen
      ? [
          { supplier: 'Alternative · Henry Schein', cost: alternativeCost, state: 'chosen', label: 'approved' },
          { supplier: 'Alternative · MediDent', cost: otherAlternativeCost },
          { supplier: 'Usual brand · Henry Schein', cost: usualCost },
          { supplier: 'Difference', cost: `−${difference}` },
        ]
      : [
          { supplier: 'Usual brand · Henry Schein', cost: usualCost, state: 'chosen', label: 'approved' },
          { supplier: 'Usual brand · MediDent', cost: otherUsualCost },
          { supplier: 'Alternative · Henry Schein', cost: alternativeCost },
          { supplier: 'Difference', cost: `+${difference}` },
        ],
    verdict: alternativeChosen
      ? 'Human decision recorded: use the alternative this time. The order is now ready to send.'
      : 'Human decision recorded: keep the familiar brand this time. The order is now ready to send.',
  };
}

function selectDecision(key, shouldScroll = false) {
  selectedDecision = key;
  const data = getDecision(key);
  const line = orderLines.find((item) => item.dataset.decisionKey === key);
  const quantity = Number(line.querySelector('[data-quantity]').textContent);
  const suggested = suggestedQuantities[key];
  const unit = line.querySelector('.quantity-static').textContent.trim().split(' ').slice(1).join(' ');
  const wasEdited = quantity !== suggested;

  receiptIndex.textContent = data.index;
  receiptTitle.textContent = wasEdited && key !== 'anaesthetic'
    ? `${quantity} ${unit} from ${line.querySelector('.supplier-cell strong').textContent.trim()}`
    : data.title;
  const editNote = key === 'anaesthetic'
    ? 'The calculation below shows the original suggestion; these prices use your edited quantity.'
    : key === 'tips'
      ? 'The calculation below shows the original suggestion; the price per tip is unchanged.'
      : 'The calculation and price comparison below show the original suggestion.';
  receiptSummary.textContent = wasEdited
    ? `${data.summary} You changed the quantity from ${suggested} to ${quantity}. ${editNote}`
    : data.summary;
  receiptMath.innerHTML = data.math;
  comparisonScope.textContent = key === 'tips'
    ? 'price per tip'
    : key === 'anaesthetic'
      ? 'same quantity · item price'
      : wasEdited
        ? 'original quantity · item + delivery'
        : 'item + delivery';
  receiptVerdict.textContent = wasEdited && key !== 'anaesthetic'
    ? `Original recommendation: ${data.verdict} The edited quantity has not been re-optimised.`
    : data.verdict;
  renderComparison(data.comparisons);

  orderLines.forEach((line) => {
    line.classList.toggle('order-line--selected', line.dataset.decisionKey === key);
  });

  if (shouldScroll && window.innerWidth <= 1080) {
    document.querySelector('.decision-receipt').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

document.querySelectorAll('[data-inspect]').forEach((button) => {
  button.addEventListener('click', () => {
    selectDecision(button.dataset.inspect, true);
  });
});

function setEditMode(active) {
  isEditing = active;
  orderLines.forEach((line) => {
    line.querySelector('.quantity-static').hidden = active;
    line.querySelector('.stepper').hidden = !active;
  });

  editBar.hidden = !active;
  editButton.hidden = active;
}

editButton.addEventListener('click', () => {
  savedQuantities = orderLines.map((line) =>
    Number(line.querySelector('[data-quantity]').textContent),
  );
  setEditMode(true);
});

document.querySelectorAll('[data-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const quantityNode = button.parentElement.querySelector('[data-quantity]');
    const currentQuantity = Number(quantityNode.textContent);
    const nextQuantity = Math.max(1, currentQuantity + Number(button.dataset.step));
    quantityNode.textContent = nextQuantity;
    updateTotals();
    selectDecision(selectedDecision);
  });
});

function syncQuantityReasons() {
  orderLines.forEach((line) => {
    const key = line.dataset.decisionKey;
    const quantity = Number(line.querySelector('[data-quantity]').textContent);
    const reason = line.querySelector('.reason-list > span');
    const icon = reason.querySelector('i');
    const unit = line.querySelector('.quantity-static').textContent.trim().split(' ').slice(1).join(' ');
    const copy = quantity === suggestedQuantities[key]
      ? suggestedReasons[key]
      : `Clinic changed to ${quantity} ${unit}; assistant suggested ${suggestedQuantities[key]} based on usual use`;
    reason.replaceChildren(icon, document.createTextNode(copy));
  });
}

cancelEditButton.addEventListener('click', () => {
  orderLines.forEach((line, index) => {
    line.querySelector('[data-quantity]').textContent = savedQuantities[index];
  });
  updateTotals();
  selectDecision(selectedDecision);
  setEditMode(false);
});

saveEditButton.addEventListener('click', () => {
  orderLines.forEach((line) => {
    const quantity = line.querySelector('[data-quantity]').textContent;
    const label = line.querySelector('.quantity-static');
    const unit = label.textContent.trim().split(' ').slice(1).join(' ');
    label.textContent = `${quantity} ${unit}`;
  });
  updateTotals();
  syncQuantityReasons();
  selectDecision(selectedDecision);
  setEditMode(false);
  showToast('Changes applied', 'The order total reflects your edited quantities.');
});

alternativeButton.addEventListener('click', () => {
  const expanded = alternativeButton.getAttribute('aria-expanded') === 'true';
  alternativeButton.setAttribute('aria-expanded', String(!expanded));
  alternativePanel.hidden = expanded;
  selectDecision('anaesthetic');
});

function resolveHumanDecision(useAlternative, showNotification = true) {
  decisionResolved = true;
  alternativeChosen = useAlternative;

  if (useAlternative) {
    warningLine.dataset.unitPrice = '43.2';
    warningLine.querySelector('.supplier-cell small').textContent = 'A$43.20 / box';
    warningLine.querySelector('.warning-reason').innerHTML =
      '<i></i>Alternative selected · A$6.30 less per box';
  } else {
    warningLine.querySelector('.warning-reason').innerHTML =
      '<i></i>Price change reviewed · familiar brand kept';
  }

  warningLine.querySelector('.review-tag').textContent = 'Reviewed';
  warningLine.querySelector('.review-tag').classList.add('review-tag--resolved');
  warningLine.classList.add('order-line--resolved');
  alternativePanel.hidden = true;
  alternativeButton.hidden = true;
  attentionPill.classList.add('attention-pill--resolved');
  decisionCount.textContent = 'Ready to send';
  reviewMetric.textContent = 'Reviewed';
  reviewMetricLabel.textContent = 'price decision recorded';
  headingCopy.textContent = 'Five recommendations with the calculation behind each. The price exception has been reviewed.';
  summaryState.textContent = 'Order ready to send';
  sendButton.dataset.ready = 'true';
  sendButton.classList.remove('primary-button--attention');
  sendButtonLabel.textContent = 'Send to 3 suppliers';
  safetyCopy.textContent = 'Sample data only. Send opens a demo confirmation screen.';

  updateTotals();
  selectDecision('anaesthetic');
  if (showNotification) {
    showToast(
      'Decision recorded',
      useAlternative
        ? 'Alternative selected — order total updated.'
        : 'Familiar brand kept — order is ready to send.',
    );
  }
}

useAlternativeButton.addEventListener('click', () => resolveHumanDecision(true));
keepCurrentButton.addEventListener('click', () => resolveHumanDecision(false));

sendButton.addEventListener('click', () => {
  if (isEditing) {
    showToast('Finish editing first', 'Save or cancel the quantity changes before sending.');
    saveEditButton.focus();
    return;
  }

  if (!decisionResolved) {
    alternativeButton.setAttribute('aria-expanded', 'true');
    alternativePanel.hidden = false;
    selectDecision('anaesthetic');
    warningLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('One decision needed', 'Review the changed anaesthetic price before sending.');
    return;
  }

  markSent();
  showSentPage();
});

function markSent() {
  orderStatus.innerHTML = '<span></span> Demo sent · no live order';
  summaryState.textContent = 'Demo order sent';
  sendButtonLabel.textContent = 'Order sent in demo';
  sendButton.disabled = true;
  editButton.disabled = true;
  notNowButton.disabled = true;
  sendButton.hidden = true;
  notNowButton.hidden = true;
  backToSentButton.hidden = false;
  safetyCopy.textContent = 'No supplier was contacted.';
}

function makeElement(tag, className, label) {
  const element = document.createElement(tag);
  element.className = className;
  if (label !== undefined) element.textContent = label;
  return element;
}

function renderSentPage() {
  const suppliers = [
    { name: 'Dental Essentials', initials: 'DE', logo: 'de', estimate: 'Thu 29 Oct' },
    { name: 'Henry Schein', initials: 'HS', logo: 'hs', estimate: 'Fri 30 Oct' },
    { name: 'MediDent', initials: 'MD', logo: 'md', estimate: 'Fri 30 Oct' },
  ];
  sentSupplierList.replaceChildren();

  suppliers.forEach((supplier) => {
    const lines = orderLines.filter((line) =>
      line.querySelector('.supplier-cell strong').textContent.trim() === supplier.name,
    );
    const card = makeElement('article', 'sent-supplier-card');
    const head = makeElement('div', 'sent-supplier-head');
    const identity = makeElement('div', 'sent-supplier-identity');
    const logo = makeElement('span', `supplier-logo supplier-logo--${supplier.logo}`, supplier.initials);
    const nameBlock = makeElement('span', '');
    nameBlock.append(
      makeElement('strong', '', supplier.name),
      makeElement('small', '', `${lines.length} ${lines.length === 1 ? 'item' : 'items'} · estimated ${supplier.estimate}`),
    );
    identity.append(logo, nameBlock);
    head.append(identity, makeElement('span', 'sent-status', 'Demo sent'));
    card.append(head);

    lines.forEach((line) => {
      const row = makeElement('div', 'sent-item-row');
      row.append(
        makeElement('span', '', line.querySelector('h3').textContent.trim()),
        makeElement('span', '', line.querySelector('.quantity-static').textContent.trim()),
        makeElement('strong', '', line.querySelector('.line-price').textContent.trim()),
      );
      card.append(row);
    });

    const foot = makeElement('div', 'sent-supplier-foot');
    foot.append(
      makeElement('span', '', 'Delivery included · supplier subtotal'),
      makeElement('strong', '', `A$${supplierTotals[supplier.name].textContent}`),
    );
    card.append(foot);
    sentSupplierList.append(card);
  });

  const total = document.querySelector('#grandTotal').textContent;
  document.querySelector('#sentTotal').textContent = total;
  document.querySelector('#sentItemsTotal').textContent = total;
  const quantity = Number(warningLine.querySelector('[data-quantity]').textContent);
  sentDecisionChoice.textContent = alternativeChosen
    ? 'Alternative · A$43.20 / box'
    : 'Familiar brand · A$49.50 / box';
  sentDecisionCopy.textContent = alternativeChosen
    ? `The clinic chose the suggested alternative after reviewing a 17% rise in the familiar brand. For ${quantity} boxes, this saves A$${formatMoney(quantity * 6.3)} on the line.`
    : `The clinic kept the familiar brand after reviewing its 17% price increase. The ${quantity}-box choice was recorded before sending.`;
}

function showSentPage() {
  renderSentPage();
  reviewPage.hidden = true;
  sentPage.hidden = false;
  window.scrollTo(0, 0);
  document.querySelector('#success-title').focus();
}

viewOrderDetailsButton.addEventListener('click', () => {
  sentPage.hidden = true;
  reviewPage.hidden = false;
  document.querySelector('.order-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelector('#order-title').focus();
});

backToSentButton.addEventListener('click', showSentPage);

replayDemoButton.addEventListener('click', () => {
  window.location.assign(window.location.href.split('#')[0]);
});

function showToast(title, detail) {
  toast.querySelector('strong').textContent = title;
  toast.querySelector('small').textContent = detail;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 4200);
}

notNowButton.addEventListener('click', () => {
  showToast('Review paused', 'Your changes remain on this page while it is open.');
});

toastCloseButton.addEventListener('click', () => {
  toast.hidden = true;
  window.clearTimeout(toastTimer);
});

updateTotals();
selectDecision(selectedDecision);

if (window.location.hash === '#review') {
  alternativeButton.setAttribute('aria-expanded', 'true');
  alternativePanel.hidden = false;
  selectDecision('anaesthetic');
}

if (window.location.hash === '#approved') {
  resolveHumanDecision(true, false);
}

if (window.location.hash === '#sent') {
  resolveHumanDecision(true, false);
  markSent();
  showSentPage();
}
