const API_BASE = 'http://localhost:3000/api';

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginSection = document.getElementById('login-section');
const profileSection = document.getElementById('profile-section');
const profileIdEl = document.getElementById('profile-id');
const profileUsernameEl = document.getElementById('profile-username');
const profileNombreEl = document.getElementById('profile-nombreCompleto');
const profileEmailEl = document.getElementById('profile-email');
const logoutBtn = document.getElementById('logout-btn');

function showLoginError(msg){
	loginError.textContent = msg;
	loginError.style.display = 'block';
}

function hideLoginError(){
	loginError.style.display = 'none';
	loginError.textContent = '';
}

function saveToken(token){
	localStorage.setItem('jwt_token', token);
}

function getToken(){
	return localStorage.getItem('jwt_token');
}

function clearToken(){
	localStorage.removeItem('jwt_token');
}

async function fetchProfile(){
	const token = getToken();
	if(!token) return;

	try{
		const res = await fetch(API_BASE + '/users/profile', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Accept': 'application/json'
			}
		});

		if(res.status === 401){
			const body = await res.json().catch(()=>({msg:'Unauthorized'}));
			showLoginError(body.msg || body.message || 'No autorizado');
			logout();
			return;
		}

		if(!res.ok){
			const text = await res.text();
			showLoginError('Error obteniendo perfil: ' + text);
			return;
		}

		const data = await res.json();
		// `data` expected shape: { ok: true, data: { id, username, nombreCompleto, email } }
		const perfil = data.data || data.user || data;
		profileIdEl.textContent = perfil.id ?? '';
		profileUsernameEl.textContent = perfil.username ?? perfil.user?.username ?? '';
		profileNombreEl.textContent = perfil.nombreCompleto ?? '';
		profileEmailEl.textContent = perfil.email ?? '';
		loginSection.style.display = 'none';
		profileSection.style.display = 'block';
	}catch(e){
		showLoginError('Error de red: ' + e.message);
	}
}

async function login(username, password){
	hideLoginError();
	try{
		const res = await fetch(API_BASE + '/oauth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({username, password})
		});

		if(res.status === 401){
			const body = await res.json().catch(()=>({message:'Credenciales inválidas'}));
			showLoginError(body.message || 'Credenciales inválidas');
			return;
		}

		if(!res.ok){
			const text = await res.text();
			showLoginError('Error: ' + text);
			return;
		}

		const body = await res.json();
		if(body && body.token){
			saveToken(body.token);
			await fetchProfile();
		} else {
			showLoginError('Respuesta inválida del servidor');
		}
	}catch(e){
		showLoginError('Error de red: ' + e.message);
	}
}

function logout(){
	clearToken();
	profileSection.style.display = 'none';
	// clear previous values
	profileIdEl.textContent = '';
	profileUsernameEl.textContent = '';
	profileNombreEl.textContent = '';
	profileEmailEl.textContent = '';
	loginSection.style.display = 'block';
}

loginForm.addEventListener('submit', (ev) => {
	ev.preventDefault();
	const username = document.getElementById('username').value.trim();
	const password = document.getElementById('password').value;
	login(username, password);
});

logoutBtn.addEventListener('click', () => {
	logout();
});

// On load, if token exists try to fetch profile
(function init(){
	const token = getToken();
	if(token){
		fetchProfile();
	}
})();

