(function () {
    const STORE = window.sessionStorage;
    const RESULT_PREFETCH_KEY = 'result_prefetch_v1';
    const RESULT_PREFETCH_TTL_MS = 10 * 60 * 1000;

    window.appStore = {
        set: function (key, value) {
            STORE.setItem(key, value);
        },
        get: function (key, fallback) {
            const value = STORE.getItem(key);
            return value === null ? fallback : value;
        },
        remove: function (key) {
            STORE.removeItem(key);
        },
        clearLeadData: function () {
            [
                'lead_name',
                'lead_phone',
                'lead_email',
                'lead_address',
                'lead_bizNum'
            ].forEach(function (key) {
                STORE.removeItem(key);
            });
        },
        clearFlowData: function () {
            [
                'step1_target',
                'step2_dessert',
                'selectedFlavor',
                'step4_milk',
                'step4_volume',
                RESULT_PREFETCH_KEY
            ].forEach(function (key) {
                STORE.removeItem(key);
            });
        },
        setPrefetchedResult: function (flavor, data) {
            if (!flavor || !data) return;
            STORE.setItem(RESULT_PREFETCH_KEY, JSON.stringify({
                flavor: flavor,
                data: data,
                fetchedAt: Date.now()
            }));
        },
        getPrefetchedResult: function (flavor) {
            const raw = STORE.getItem(RESULT_PREFETCH_KEY);
            if (!raw) return null;

            try {
                const parsed = JSON.parse(raw);
                const isExpired = !parsed.fetchedAt || (Date.now() - parsed.fetchedAt) > RESULT_PREFETCH_TTL_MS;
                if (isExpired || parsed.flavor !== flavor || !parsed.data || !parsed.data.name) {
                    STORE.removeItem(RESULT_PREFETCH_KEY);
                    return null;
                }
                return parsed.data;
            } catch (error) {
                STORE.removeItem(RESULT_PREFETCH_KEY);
                return null;
            }
        },
        clearResultCache: function () {
            STORE.removeItem(RESULT_PREFETCH_KEY);
        }
    };

    window.onCardKeyActivate = function (event, callback) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            callback();
        }
    };
})();
