import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

//Flatpickr
import 'flatpickr/dist/flatpickr.css';

// TippyJs
import 'tippy.js/dist/tippy.css';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
// import router from './router/index';
import RenderRoutes from './router';
// Redux
import { Provider } from 'react-redux';
import store from './store/index';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';

// TanStack/React-Query
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './configs/query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const isDeveloping = import.meta.env.VITE_NODE_ENV;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistStore(store)}>
                    <QueryClientProvider client={queryClient}>
                        {/* <RouterProvider router={router} /> */}
                        {isDeveloping === 'dev' ? <ReactQueryDevtools initialIsOpen={false} /> : ''}
                        <RenderRoutes />
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
        </Suspense>
    </React.StrictMode>
);
