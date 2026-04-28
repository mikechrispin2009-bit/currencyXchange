const rates = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 148.50, RWF: 1300,
    CAD: 1.35, AUD: 1.52, CHF: 0.91, CNY: 7.25, INR: 83.50
};
const currencyNames = {
    USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
    RWF: "Rwandan Franc", CAD: "Canadian Dollar", AUD: "Australian Dollar",
    CHF: "Swiss Franc", CNY: "Chinese Yuan", INR: "Indian Rupee"
};
const currencyFlags = {
    USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", RWF: "🇷🇼",
    CAD: "🇨🇦", AUD: "🇦🇺", CHF: "🇨🇭", CNY: "🇨🇳", INR: "🇮🇳"
};
const trendData = {
    USD: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
    EUR: [0.94, 0.93, 0.92, 0.91, 0.92, 0.91, 0.92],
    GBP: [0.81, 0.80, 0.79, 0.78, 0.79, 0.78, 0.79],
    JPY: [146.20, 147.50, 148.00, 149.10, 148.80, 148.00, 148.50],
    RWF: [1280, 1290, 1300, 1310, 1305, 1295, 1300],
    CAD: [1.33, 1.34, 1.35, 1.36, 1.35, 1.34, 1.35],
    AUD: [1.50, 1.51, 1.52, 1.53, 1.52, 1.51, 1.52],
    CHF: [0.93, 0.92, 0.91, 0.90, 0.91, 0.90, 0.91],
    CNY: [7.18, 7.20, 7.22, 7.25, 7.24, 7.22, 7.25],
    INR: [82.50, 83.00, 83.20, 83.50, 83.40, 83.20, 83.50]
}
const historicalData = {
    USD: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
    EUR: [0.94, 0.93, 0.92, 0.91, 0.92, 0.92],
    GBP: [0.81, 0.80, 0.79, 0.78, 0.79, 0.79],
    JPY: [146.20, 147.50, 148.00, 149.10, 148.80, 148.50],
    RWF: [1280, 1290, 1300, 1310, 1305, 1300],
    CAD: [1.33, 1.34, 1.35, 1.36, 1.35, 1.35],
    AUD: [1.50, 1.51, 1.52, 1.53, 1.52, 1.52],
    CHF: [0.93, 0.92, 0.91, 0.90, 0.91, 0.91],
    CNY: [7.18, 7.20, 7.22, 7.25, 7.24, 7.25],
    INR: [82.50, 83.00, 83.20, 83.50, 83.40, 83.50]
};
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June'];
function filterCurrencies(type) {
    let searchTerm = document.getElementById(`search${type}`).value.toLowerCase();
    let select = document.getElementById(`quick${type}`);
    let options = select.options;
    
    for (let i = 0; i < options.length; i++) {
        let text = options[i].text.toLowerCase();
        if (text.includes(searchTerm)) {
            options[i].style.display = '';
        } else {
            options[i].style.display = 'none';
        }
    }
}
function swapCurrencies() {
    let from = document.getElementById('quickFrom');
    let to = document.getElementById('quickTo');
    let temp = from.value;
    from.value = to.value;
    to.value = temp;
    
    let amount = document.getElementById('quickAmount');
    if (amount.value && amount.value > 0) {
        quickConvert();
    }
}
function quickConvert() {
    let amount = document.getElementById('quickAmount').value;
    let from = document.getElementById('quickFrom').value;
    let to = document.getElementById('quickTo').value;
    let resultDiv = document.getElementById('resultArea');
    if(!amount || amount <= 0) {
        resultDiv.innerHTML = '<h4 style="color: red;">❌ Please enter a valid amount</h4>';
        return;
    }
    let usdAmount = amount / rates[from];
    let converted = usdAmount * rates[to];
    let rate = rates[to] / rates[from];
    let history = JSON.parse(localStorage.getItem('history') || '[]');
    history.unshift({
        date: new Date().toLocaleString(),
        from: from, to: to, amount: amount, result: converted.toFixed(2)
    });
    localStorage.setItem('history', JSON.stringify(history.slice(0, 20)));
    resultDiv.innerHTML = `
        <div style="background:#f8f9fa;padding:15px;border-radius:5px;text-align:left">
            <p><strong>✅ Converted:</strong> ${amount} ${from} = ${converted.toFixed(2)} ${to}</p>
            <p><strong>📊 Exchange Rate:</strong> 1 ${from} = ${rate.toFixed(4)} ${to}</p>
            <p><strong>🕐 Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
}
function loadHistory() {
    let history = JSON.parse(localStorage.getItem('history') || '[]');
    let tbody = document.getElementById('historyBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    if(history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">📭 No history yet</td></tr>';
        return;
    }  
    history.forEach(item => {
        let row = tbody.insertRow();
        row.insertCell(0).innerHTML = item.date;
        row.insertCell(1).innerHTML = `${currencyFlags[item.from] || ''} ${item.from}`;
        row.insertCell(2).innerHTML = `${currencyFlags[item.to] || ''} ${item.to}`;
        row.insertCell(3).innerHTML = item.amount;
        row.insertCell(4).innerHTML = item.result;
    });
}
function clearHistory() {
    if(confirm('⚠️ Clear all history?')) {
        localStorage.removeItem('history');
        loadHistory();
    }
}
function applyFilter() {
    let filter = document.getElementById('filterCurrency').value;
    let history = JSON.parse(localStorage.getItem('history') || '[]');
    let filtered = filter === 'all' ? history : history.filter(h => h.from === filter || h.to === filter);
    let tbody = document.getElementById('historyBody');
    tbody.innerHTML = '';
    filtered.forEach(item => {
        let row = tbody.insertRow();
        row.insertCell(0).innerHTML = item.date;
        row.insertCell(1).innerHTML = `${currencyFlags[item.from] || ''} ${item.from}`;
        row.insertCell(2).innerHTML = `${currencyFlags[item.to] || ''} ${item.to}`;
        row.insertCell(3).innerHTML = item.amount;
        row.insertCell(4).innerHTML = item.result;
    });
}
function toggleDarkMode() {
    let isDark = document.getElementById('darkModeToggle').checked;
    
    if(isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        document.getElementById('modeText').innerHTML = 'Dark Mode';
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        document.getElementById('modeText').innerHTML = 'Light Mode';
    }
}
function saveSettings() {
    let darkMode = document.getElementById('darkModeToggle').checked;
    let defaultCurrency = document.getElementById('defaultCurrency').value;
    localStorage.setItem('darkMode', darkMode ? 'enabled' : 'disabled');
    localStorage.setItem('defaultCurrency', defaultCurrency);
    if(darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    applyDefaultCurrency();
    alert('✅ Settings saved successfully!');
}
function applySettings() {
    if(localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        if(document.getElementById('darkModeToggle')) {
            document.getElementById('darkModeToggle').checked = true;
            document.getElementById('modeText').innerHTML = 'Dark Mode';
        }
    }
    applyDefaultCurrency();
}
function applyDefaultCurrency() {
    let defaultCurrency = localStorage.getItem('defaultCurrency');
    if(defaultCurrency && document.getElementById('quickFrom')) {
        document.getElementById('quickFrom').value = defaultCurrency;
    }
    if(defaultCurrency && document.getElementById('defaultCurrency')) {
        document.getElementById('defaultCurrency').value = defaultCurrency;
    }
}
function renderTrendTable(currency) {
    const trends = trendData[currency];
    if(!trends) return;
    
    const tbody = document.getElementById('trendBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    for(let i = 0; i < trends.length; i++) {
        let change = '';
        let changeClass = '';
        if(i > 0) {
            let difference = trends[i] - trends[i-1];
            if(difference > 0) {
                change = `▲ +${difference.toFixed(4)}`;
                changeClass = 'trend-up';
            } else if(difference < 0) {
                change = `▼ ${difference.toFixed(4)}`;
                changeClass = 'trend-down';
            } else {
                change = '→ 0.0000';
                changeClass = 'trend-neutral';
            }
        } else {
            change = '—';
            changeClass = 'trend-neutral';
        }
        const row = tbody.insertRow();
        row.insertCell(0).innerHTML = days[i];
        row.insertCell(1).innerHTML = trends[i].toFixed(4);
        row.insertCell(2).innerHTML = `<span class="${changeClass}">${change}</span>`;
    }
}
function updateCurrencyDetails() {
    const currencySelect = document.getElementById('currencySelect');
    if(!currencySelect) return;
    const currency = currencySelect.value;
    const currencyNameEl = document.getElementById('currencyName');
    const exchangeRateEl = document.getElementById('exchangeRate');
    const currencyCodeEl = document.getElementById('currencyCode');
    if(currencyNameEl) currencyNameEl.innerHTML = `${currencyFlags[currency]} ${currencyNames[currency]}`;
    if(exchangeRateEl) exchangeRateEl.innerHTML = rates[currency].toFixed(4);
    if(currencyCodeEl) currencyCodeEl.innerHTML = currency;
    renderTrendTable(currency);
    const tbody = document.getElementById('comparisonBody');
    if(tbody) {
        tbody.innerHTML = '';
        for(let [code, rate] of Object.entries(rates)) {
            if(code !== currency) {
                const row = tbody.insertRow();
                row.insertCell(0).innerHTML = `${currencyFlags[code]} ${currencyNames[code]} (${code})`;
                row.insertCell(1).innerHTML = `1 ${currency} = ${(1 / rates[currency] * rate).toFixed(4)} ${code}`;
                row.insertCell(2).innerHTML = `1 ${code} = ${(rates[currency] / rate).toFixed(4)} ${currency}`;
            }
        }
    }
    const histDiv = document.getElementById('historicalList');
    if(histDiv) {
        histDiv.innerHTML = '';
        const histRates = historicalData[currency];
        if(histRates) {
            for(let i = 0; i < months.length; i++) {
                const item = document.createElement('div');
                item.className = 'historical-item';
                item.innerHTML = `<span><strong>${months[i]} 2025</strong></span><span>1 USD = ${histRates[i].toFixed(4)} ${currency}</span>`;
                histDiv.appendChild(item);
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    applySettings();
    if(document.getElementById('historyBody')) loadHistory();
    if(document.getElementById('currencySelect')) updateCurrencyDetails();
    
    if(document.getElementById('searchFrom')) {
        document.getElementById('searchFrom').addEventListener('keyup', function() {
            filterCurrencies('From');
        });
    }
    if(document.getElementById('searchTo')) {
        document.getElementById('searchTo').addEventListener('keyup', function() {
            filterCurrencies('To');
        });
    }
});