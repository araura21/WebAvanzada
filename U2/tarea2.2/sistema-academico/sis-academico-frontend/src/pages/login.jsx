import React, { useState } from 'react';

/**
 * Componente Login2 reutilizable
 * @param {Object} config - Configuración del componente
 * @param {string} config.apiUrl - URL de la API de login (default: http://localhost:3000/api/auth/login)
 * @param {string} config.logoUrl - URL del logo (default: /layout/images/pages/login/icon-login.svg)
 * @param {string} config.title - Título del login (default: Sign in to Avalon)
 * @param {string} config.subtitle - Subtítulo (default: Welcome, please use the form to sign-in Avalon network)
 * @param {function} config.onLoginSuccess - Callback cuando el login es exitoso
 * @param {function} config.onLoginError - Callback cuando el login falla
 * @param {string} config.tokenStorageKey - Clave para almacenar el token (default: token)
 * @param {boolean} config.useLocalStorage - Usar localStorage para guardar el token (default: true)
 */
const Login2 = ({
  apiUrl = 'http://localhost:3000/api/auth/login',
  logoUrl = '/layout/images/pages/login/icon-login.svg',
  title = 'Sign in to Avalon',
  subtitle = 'Welcome, please use the form to sign-in Avalon network',
  onLoginSuccess = null,
  onLoginError = null,
  tokenStorageKey = 'token',
  useLocalStorage = true
} = {}) => {
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      const errorMsg = 'Por favor ingresa usuario y contraseña';
      if (onLoginError) {
        onLoginError(errorMsg);
      } else {
        alert(errorMsg);
      }
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: username,
          password
        })
      });

      const data = await resp.json();

      // Buscar el token en diferentes campos posibles
      const token = data.token || data.accessToken;

      if (resp.ok && token) {
        if (useLocalStorage) {
          localStorage.setItem(tokenStorageKey, token);
          // Guardar información adicional del usuario si está disponible
          if (data.usuario) {
            localStorage.setItem('usuario', data.usuario);
          }
          if (data.rol) {
            localStorage.setItem('rol', data.rol);
          }
        }

        if (onLoginSuccess) {
          onLoginSuccess(data);
        } else {
          alert('Login exitoso');
        }
      } else {
        const errorMsg = data.mensaje || data.message || 'Credenciales incorrectas';
        if (onLoginError) {
          onLoginError(errorMsg);
        } else {
          alert(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      const errorMsg = 'Error al conectar con el servidor';
      if (onLoginError) {
        onLoginError(errorMsg);
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="bg-primary-reverse bg-primary-50">
      <div className="flex justify-content-center">
        <div className="w-full lg:w-5 h-screen text-center flex justify-content-center align-items-start">
          <div className="z-5 w-full lg:w-8 px-6 text-center mt-8" style={{ maxWidth: '400px' }}>
            <div className="w-full flex align-items-center justify-content-center">
              <img src={logoUrl} alt="login-icon" className="w-6rem" />
            </div>
            <h1 className="text-4xl font-light mt-4 text-primary-500">{title}</h1>
            <p>{subtitle}</p>
            <div className="mt-5 text-left">
              <label htmlFor="username" className="block mb-2" style={{ color: '#4c566a' }}>
                Username
              </label>
              <span className="p-input-icon-right block">
                <i className="pi pi-user"></i>
                <input
                  id="username"
                  type="text"
                  value={username}
                  className="w-full p-3 border-1 border-surface-border border-round"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </span>

              <label htmlFor="password" className="block mb-2 mt-3" style={{ color: '#4c566a' }}>
                Password
              </label>
              <span className="p-input-icon-right block">
                <i className="pi pi-lock"></i>
                <input
                  id="password"
                  type="password"
                  value={password}
                  className="w-full p-3 border-1 border-surface-border border-round"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </span>

              <div className="flex align-items-center justify-content-between mt-5">
                <div className="flex align-items-center">
                  <input
                    type="checkbox"
                    id="rememberme1"
                    onChange={(e) => setChecked(e.target.checked)}
                    checked={checked}
                    className="mr-2"
                    disabled={loading}
                  />
                  <label htmlFor="rememberme1">Remember me</label>
                </div>
              </div>

              <div className="flex align-items-center justify-content-between mt-4 gap-3">
                <button
                  onClick={handleLogin}
                  disabled={loading || !username || !password}
                  className="w-10rem p-3 bg-primary-500 text-white border-none border-round cursor-pointer"
                  style={{
                    opacity: loading || !username || !password ? 0.6 : 1,
                    cursor: loading || !username || !password ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <a href="#" className="text-primary" style={{ textDecoration: 'none' }}>
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="absolute bottom-0 w-screen"
          viewBox="0 0 1440 250"
        >
          <defs>
            <linearGradient id="c" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-200)" />
              <stop offset="99.052%" stopColor="var(--primary-300)" />
            </linearGradient>
            <path
              id="b"
              d="M0 202c142.333-66.667 249-90 320-70 106.5 30 122 83.5 195 83.5h292c92.642-106.477 190.309-160.81 293-163 102.691-2.19 216.025 47.643 340 149.5v155.5H0V202z"
            />
            <filter id="a" width="105.1%" height="124.3%" x="-2.6%" y="-12.8%" filterUnits="objectBoundingBox">
              <feOffset dy="-2" in="SourceAlpha" result="shadowOffsetOuter1" />
              <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="12" />
              <feColorMatrix
                in="shadowBlurOuter1"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0"
              />
            </filter>
            <linearGradient id="d" x1="50%" x2="50%" y1="0%" y2="99.142%">
              <stop offset="0%" stopColor="var(--primary-300)" />
              <stop offset="100%" stopColor="var(--primary-500)" />
            </linearGradient>
          </defs>
          <g fill="none" fillRule="evenodd">
            <g transform="translate(0 .5)">
              <use fill="#000" filter="url(#a)" xlinkHref="#b" />
              <use fill="url(#c)" xlinkHref="#b" />
            </g>
            <path
              fill="url(#d)"
              d="M0 107c225.333 61.333 364.333 92 417 92 79 0 194-79.5 293-79.5S914 244 1002 244s156-45 195-68.5c26-15.667 107-74.167 243-175.5v357.5H0V107z"
              transform="translate(0 .5)"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Login2;
