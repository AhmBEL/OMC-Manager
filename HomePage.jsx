import React, { useMemo } from 'react';

export default function HomePage({ 
  products, 
  assemblages, 
  formules, 
  fournisseurs, 
  settings, 
  viewMode, 
  setViewMode,
  setShowPasswordModal,
  setPage,
  dbConnected,
  lastSync 
}) {
  
  // Stats calculées
  const stats = useMemo(() => {
    const produitsActifs = products.filter(p => p.selectionneOMC);
    const assemblagesActifs = assemblages.filter(a => a.actif);
    const formulesActives = (formules || []).filter(f => f.actif);
    
    // Score de santé (simplifié)
    let problemes = 0;
    if (products.filter(p => !p.prixVente || p.prixVente <= 0).length > 0) problemes++;
    if (assemblages.filter(a => !a.composants || a.composants.length === 0).length > 0) problemes++;
    if (assemblages.filter(a => !a.prixVente || a.prixVente <= 0).length > 0) problemes++;
    const scoreSante = Math.max(0, 100 - (problemes * 15));
    
    return {
      produitsTotal: products.length,
      produitsActifs: produitsActifs.length,
      assemblagesTotal: assemblages.length,
      assemblagesActifs: assemblagesActifs.length,
      formulesTotal: (formules || []).length,
      formulesActives: formulesActives.length,
      fournisseurs: fournisseurs.length,
      scoreSante,
      problemes
    };
  }, [products, assemblages, formules, fournisseurs]);

  // Heure actuelle
  const now = new Date();
  const heureActuelle = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const dateActuelle = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Couleur du score de santé
  const couleurSante = stats.scoreSante >= 80 ? 'emerald' : stats.scoreSante >= 50 ? 'amber' : 'red';

  return (
    <div className="space-y-8">
      {/* Section Bienvenue */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-amber-100 text-sm mb-1">Bienvenue sur</p>
            <h1 className="text-4xl font-bold mb-2">🍰 OMC Manager</h1>
            <p className="text-amber-100">
              {dateActuelle} • <span className="font-semibold">{heureActuelle}</span>
            </p>
          </div>
          
          {/* Sélecteur de profil */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-amber-100 text-xs mb-2 text-center">Mode d'accès</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('employe')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'employe' 
                    ? 'bg-white text-amber-600 shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}>
                👤 Employé
              </button>
              <button 
                onClick={() => viewMode === 'manager' || viewMode === 'admin' ? setViewMode('manager') : setShowPasswordModal('manager')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'manager' 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}>
                👔 Manager
              </button>
              <button 
                onClick={() => viewMode === 'admin' ? null : setShowPasswordModal('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'admin' 
                    ? 'bg-white text-emerald-600 shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}>
                🔓 Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm">Produits</p>
              <p className="text-3xl font-bold text-stone-800">{stats.produitsActifs}</p>
              <p className="text-xs text-stone-400">sur {stats.produitsTotal} total</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
              🛒
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm">Assemblages</p>
              <p className="text-3xl font-bold text-stone-800">{stats.assemblagesActifs}</p>
              <p className="text-xs text-stone-400">sur {stats.assemblagesTotal} total</p>
            </div>
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-2xl">
              🍔
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm">Formules</p>
              <p className="text-3xl font-bold text-stone-800">{stats.formulesActives}</p>
              <p className="text-xs text-stone-400">sur {stats.formulesTotal} total</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              🍱
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm">Fournisseurs</p>
              <p className="text-3xl font-bold text-stone-800">{stats.fournisseurs}</p>
              <p className="text-xs text-stone-400">enregistrés</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
              🏭
            </div>
          </div>
        </div>
      </div>

      {/* Raccourcis et Santé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Raccourcis rapides */}
        <div className="md:col-span-2 bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>⚡</span> Accès rapide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button onClick={() => setPage('catalogue')}
              className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-md transition-all text-left group">
              <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🛒</span>
              <p className="font-medium text-stone-800 mt-2">Catalogue</p>
              <p className="text-xs text-stone-500">Gérer les produits</p>
            </button>
            
            <button onClick={() => setPage('assemblages')}
              className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200 hover:shadow-md transition-all text-left group">
              <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🍔</span>
              <p className="font-medium text-stone-800 mt-2">Assemblages</p>
              <p className="text-xs text-stone-500">Produits composés</p>
            </button>
            
            <button onClick={() => setPage('formules')}
              className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-all text-left group">
              <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🍱</span>
              <p className="font-medium text-stone-800 mt-2">Formules</p>
              <p className="text-xs text-stone-500">Menus & combos</p>
            </button>
            
            <button onClick={() => setPage('dashboard-sante')}
              className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all text-left group">
              <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🏥</span>
              <p className="font-medium text-stone-800 mt-2">Santé BDD</p>
              <p className="text-xs text-stone-500">Vérifier la cohérence</p>
            </button>
            
            <button onClick={() => setPage('dashboard-perf')}
              className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 hover:shadow-md transition-all text-left group">
              <span className="text-2xl group-hover:scale-110 transition-transform inline-block">📈</span>
              <p className="font-medium text-stone-800 mt-2">Performance</p>
              <p className="text-xs text-stone-500">KPI & statistiques</p>
            </button>
            
            {viewMode === 'admin' && (
              <button onClick={() => setPage('parametres')}
                className="p-4 bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl border border-stone-200 hover:shadow-md transition-all text-left group">
                <span className="text-2xl group-hover:scale-110 transition-transform inline-block">⚙️</span>
                <p className="font-medium text-stone-800 mt-2">Paramètres</p>
                <p className="text-xs text-stone-500">Configuration</p>
              </button>
            )}
          </div>
        </div>

        {/* Santé du système */}
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>🏥</span> Santé système
          </h2>
          
          {/* Score circulaire */}
          <div className="flex flex-col items-center mb-4">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-${couleurSante}-400 to-${couleurSante}-600 flex items-center justify-center shadow-lg`}>
              <span className="text-3xl font-bold text-white">{stats.scoreSante}%</span>
            </div>
            <p className={`mt-2 font-medium text-${couleurSante}-600`}>
              {stats.scoreSante >= 80 ? '✨ Excellent' : stats.scoreSante >= 50 ? '⚠️ À surveiller' : '🚨 Attention'}
            </p>
          </div>
          
          {stats.problemes > 0 ? (
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-amber-700 text-sm">
                {stats.problemes} problème{stats.problemes > 1 ? 's' : ''} détecté{stats.problemes > 1 ? 's' : ''}
              </p>
              <button onClick={() => setPage('dashboard-sante')}
                className="mt-2 text-amber-600 text-sm font-medium hover:underline">
                Voir les détails →
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <p className="text-emerald-700 text-sm">Tout est en ordre ! 🎉</p>
            </div>
          )}
          
          {/* Connexion Supabase */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Base de données</span>
              {dbConnected ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Connecté
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Hors-ligne
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sync Loyverse */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
              🔄
            </div>
            <div>
              <h3 className="font-semibold text-stone-800">Synchronisation Loyverse</h3>
              <p className="text-sm text-stone-500">
                {lastSync 
                  ? `Dernière sync : ${new Date(lastSync).toLocaleDateString('fr-FR')} à ${new Date(lastSync).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`
                  : 'Non configuré - Connectez Loyverse pour synchroniser vos ventes'
                }
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {lastSync ? (
              <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm">
                🔄 Sync maintenant
              </button>
            ) : (
              <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm">
                🔧 Configurer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conseils du jour (optionnel) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-amber-800">Astuce du jour</h3>
            <p className="text-amber-700 text-sm mt-1">
              {viewMode === 'employe' 
                ? "Utilisez le mode Admin pour accéder à toutes les fonctionnalités de gestion."
                : viewMode === 'manager'
                ? "Consultez le Dashboard Performance pour suivre vos KPI en temps réel."
                : "Pensez à vérifier régulièrement la Santé BDD pour maintenir la cohérence de vos données."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
