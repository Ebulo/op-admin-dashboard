import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';

interface JwtPayload {
    exp: number;
}

export const useJwtExpiryChecker = (checkInterval = 60 * 1000) => {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('jwt'); // Or use cookies if applicable
            if (!token) {
                router.push('/signin');
                return;
            }

            try {
                const decoded = jwtDecode<JwtPayload>(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    router.push('/signin');
                }
            } catch (err) {
                console.warn("ERROR: ", err);

                router.push('/signin');
            }
        }, checkInterval); // default: every 1 minute

        return () => clearInterval(interval);
    }, [router, checkInterval]);
};