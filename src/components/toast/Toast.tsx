'use client';
import toast, { Toaster, ToastBar } from 'react-hot-toast';

const GlassToast = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 5000,
                style: {
                    backdropFilter: 'blur(100px)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '4px solid rgba(0, 0, 0, 0.21)',
                    // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    color: '#000',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    fontWeight: '600',
                    fontSize: '15px',
                    lineHeight: '1.4',
                    zIndex: '999999',
                },
                success: {
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#1e1e1e',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#1e1e1e',
                    },
                },
            }}
        >
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {icon}
                            <span style={{ flex: 1 }}>{message}</span>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    padding: '0',
                                    marginLeft: '10px',
                                    lineHeight: '1',
                                }}
                                aria-label="Close toast"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
};

export default GlassToast;