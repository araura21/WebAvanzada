import React, { useState } from 'react';
import { validarTexto } from '../utils/validations';

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
import './login.css';

const Login = ({
  apiUrl = 'http://localhost:3000/api/auth/login',
  logoUrl = '/layout/images/pages/login/icon-login.svg',
  title = 'Sistema Academico',
  subtitle = 'Bienvenido, Por favor inicia sesion',
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

    if (!validarTexto(username)) {
      const errorMsg = 'El usuario contiene caracteres no permitidos';
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
          // Limpiar datos previos
          localStorage.clear();

          localStorage.setItem(tokenStorageKey, token);
          // Guardar información adicional del usuario si está disponible
          if (data.usuario) {
            localStorage.setItem('usuario', data.usuario);
          }
          if (data.rol) {
            localStorage.setItem('rol', data.rol);
          }
          if (data.docenteId) {
            localStorage.setItem('docenteId', data.docenteId);
          }
          if (data.estudianteId) {
            localStorage.setItem('estudianteId', data.estudianteId);
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
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-5">
          {/* If you want to use the logo, uncomment this. For now using text/icon mostly. */}
          {/* <img src={logoUrl} alt="Logo" className="w-4rem mb-3" /> */}
          <div className="mb-3 text-center">
            <i className="bi bi-shield-check" style={{ fontSize: '3rem', color: '#6366f1' }}></i>
          </div>
          <h1 className="login-title text-3xl">{title}</h1>
          <p className="login-subtitle">{subtitle}</p>
        </div>

        <div className="form-content">
          <div className="login-form-group">
            <label htmlFor="username" className="input-label">Usuario</label>
            <div className="input-wrapper">
              <i className="bi bi-person input-icon"></i>
              <input
                id="username"
                type="text"
                className="custom-input"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="input-label">Contraseña</label>
            <div className="input-wrapper">
              <i className="bi bi-lock input-icon"></i>
              <input
                id="password"
                type="password"
                className="custom-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex-between">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                disabled={loading}
              />
              <span>Recordarme</span>
            </label>
            <a href="#" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="login-button"
          >
            {loading ? (
              <span><i className="bi bi-arrow-repeat spin mr-2"></i> Iniciando...</span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
