import http from 'k6/http';
import { check, group } from 'k6';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8081'; // 🔁 à adapter si nécessaire

export const options = {
  vus: 5,
  duration: '30s',
};

const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin123!',
};

let token = '';

export function setup() {
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/authenticate`, JSON.stringify(ADMIN_CREDENTIALS), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    '✅ Login réussi': (res) => res.status === 200 && res.json('token') !== '',
  });

  token = loginRes.json('token');
  return { token };
}

export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  group('🔐 BlacklistController', () => {
    const res1 = http.get(`${BASE_URL}/api/v1/blacklist`, { headers });
    check(res1, { '📄 GET /blacklist OK': (r) => r.status === 200 });
    sleep(1);

    // Toggle test: ❗️Remplace 1 par un ID existant dans ta base
    const res2 = http.post(`${BASE_URL}/api/v1/blacklist/toggle/1`, null, { headers });
    check(res2, { '🔁 POST /blacklist/toggle OK': (r) => r.status === 200 || r.status === 204 });
  });

  group('📜 BlHistoryController', () => {
    const now = new Date().toISOString();
    const url = `${BASE_URL}/api/v1/blhistory?msisdn=21456789&start=${now}`;
    const res = http.get(url, { headers });
    check(res, { '🕵️ GET /blhistory OK': (r) => r.status === 200 });
  });

  group('📊 JimDashboardController', () => {
    const now = new Date().toISOString();
    const url = `${BASE_URL}/api/v1/dashboard?msisdn=21456789&hotline=HOTLINE101&start=${now}`;
    const res = http.get(url, { headers });
    check(res, { '📈 GET /dashboard OK': (r) => r.status === 200 });
  });

    group('🧪 Extended PermissionListController', () => {


        const permissionsRes = http.get(`${BASE_URL}/api/v1/permissions`, { headers });
const permissions = permissionsRes.json();

if (permissions.length < 3) {
  console.error("❌ Pas assez de permissions dans la base pour le test !");
  return;
}

const perm1 = permissions[0].id;
const perm2 = permissions[1].id;
const perm3 = permissions[2].id;


    // 🔢 Crée une nouvelle liste pour tester
    const listName = `k6-ext-list-${Math.random().toString(36).substring(7)}`;
    const createRes = http.post(`${BASE_URL}/api/v1/permission-lists?name=${listName}`, JSON.stringify([perm1]), {
      headers,
    });
    check(createRes, { '🆕 Create list OK': (r) => r.status === 200 });
    const createdList = createRes.json();

    // 🛠️ Update list
    const updatedName = listName + '-updated';
    const updateRes = http.put(`${BASE_URL}/api/v1/permission-lists/${createdList.id}?name=${updatedName}`, JSON.stringify([perm1]), {
      headers,
    });
    check(updateRes, { '✏️ Update list OK': (r) => r.status === 200 });

    // ➕ Add single permission
    const assignRes = http.post(`${BASE_URL}/api/v1/permission-lists/${createdList.id}/permissions/${perm1}`, null, { headers });
    check(assignRes, { '🔗 Assign single permission OK': (r) => r.status === 200 });

    // ➕ Add multiple permissions
    const addMultiRes = http.post(`${BASE_URL}/api/v1/permission-lists/${createdList.id}/permissions`, JSON.stringify([perm2, perm3]), { headers });
    check(addMultiRes, { '📦 Add multiple permissions OK': (r) => r.status === 200 });

    // ❌ Remove a permission
    const removeRes = http.del(`${BASE_URL}/api/v1/permission-lists/${createdList.id}/permissions/${perm2}`, null, { headers });
    check(removeRes, { '❌ Remove permission OK': (r) => r.status === 200 });

    // 📋 List all permission lists
    const listRes = http.get(`${BASE_URL}/api/v1/permission-lists`, { headers });
    check(listRes, { '📋 List all permission lists OK': (r) => r.status === 200 });

    // 🗑️ Delete the list created
    const deleteRes = http.del(`${BASE_URL}/api/v1/permission-lists/${createdList.id}`, null, { headers });
    check(deleteRes, { '🗑️ Delete permission list OK': (r) => r.status === 204 });
  });



  group('🛡️ RoleController extended tests', () => {
    // 1️⃣ Récupération des permissionLists existantes
    const plRes = http.get(`${BASE_URL}/api/v1/permission-lists`, { headers });
    const permissionLists = plRes.json();
    if (permissionLists.length < 2) {
      console.error("❌ Pas assez de permission lists pour tester les rôles.");
      return;
    }
    const pl1 = permissionLists[0].id;
    const pl2 = permissionLists[1].id;

    // 2️⃣ Création du rôle
    const roleName = `k6-role-${Math.random().toString(36).substring(7)}`;
    const createRes = http.post(`${BASE_URL}/api/v1/roles?name=${roleName}`, JSON.stringify([pl1]), {
      headers,
    });
    check(createRes, { '🆕 Create role OK': (r) => r.status === 200 });
    const createdRole = createRes.json();

    // 3️⃣ Mise à jour du rôle
    const updatedName = roleName + '-updated';
    const updateRes = http.put(`${BASE_URL}/api/v1/roles/${createdRole.id}?name=${updatedName}`, JSON.stringify([pl1, pl2]), {
      headers,
    });
    check(updateRes, { '✏️ Update role OK': (r) => r.status === 200 });

    // 4️⃣ Ajout permissionLists au rôle (même si déjà assignés pour tester)
    const assignPLsRes = http.put(`${BASE_URL}/api/v1/roles/${createdRole.id}/permission-lists`, JSON.stringify([pl2]), { headers });
    check(assignPLsRes, { '➕ Add permission list to role OK': (r) => r.status === 200 });

    // 5️⃣ Get permissionLists du rôle
    const getPLsRes = http.get(`${BASE_URL}/api/v1/roles/${createdRole.id}/permission-lists`, { headers });
    check(getPLsRes, { '📋 Get role permission lists OK': (r) => r.status === 200 });

    // 6️⃣ Supprimer une seule permissionList
    const deleteOnePLRes = http.del(`${BASE_URL}/api/v1/roles/${createdRole.id}/permission-lists/${pl2}`, null, { headers });
    check(deleteOnePLRes, { '❌ Remove one permission list from role OK': (r) => r.status === 200 });

    // 7️⃣ Supprimer complètement le rôle
    const deleteRes = http.del(`${BASE_URL}/api/v1/roles/${createdRole.id}`, null, { headers });
    check(deleteRes, { '🗑️ Delete role OK': (r) => r.status === 204 });

    // 8️⃣ Vérifier liste des rôles
    const listRes = http.get(`${BASE_URL}/api/v1/roles`, { headers });
    check(listRes, { '📄 List roles OK': (r) => r.status === 200 });
  });





  group('🙋 UserController', () => {
    const usersRes = http.get(`${BASE_URL}/api/v1/users`, { headers });
    check(usersRes, { '👤 GET /users OK': (r) => r.status === 200 });

    const firstUser = usersRes.json()[0];
    if (firstUser) {
      const rolesRes = http.get(`${BASE_URL}/api/v1/users/${firstUser.id}/roles`, { headers });
      check(rolesRes, { '📋 GET /users/{id}/roles OK': (r) => r.status === 200 });
    }
  });

  sleep(1);
}
