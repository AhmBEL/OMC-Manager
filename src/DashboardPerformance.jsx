import React, { useMemo, useState } from 'react';

export default function DashboardPerformance({ products, assemblages, formules, settings, viewMode, ventesStats, lastSync, onRefresh }) {
  const isRestricted = viewMode !== 'admin';
  const [isLoading, setIsLoading] = useState(false);

  // Utiliser les vraies stats si disponibles
  const stats = ventesStats || {
    caTotal: 0,
    nbTransactions: 0,
    nbArticles: 0,
    panierMoyen: 0,
    coutTotal: 0,
    margeTotal: 0,
    margePct: 0,
    topProduits: [],
    ventesParJour: [],
    ventesParHeure: []
  };

  const hasVentes = stats.nbTransactions > 0;

  // Données du catalogue pour estimation
  const catalogueStats = useMemo(() => {
    const produitsActifs = products.filter(p => p.selectionneOMC);
    const assemblagesActifs = assemblages.filter(a => a.actif);
    const formulesActives = (formules || []).filter(f => f.actif);

    return {
      nbProduitsActifs: produitsActifs.length,
      nbAssemblagesActifs: assemblagesActifs.length,
      nbFormulesActives: formulesActives.length
    };
  }, [products, assemblages, formules]);

  // Formater la date de dernière sync
  const formatLastSync = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`;
  };

  // Jours de la semaine pour le graphique
  const joursGraphique = useMemo(() => {
    if (!stats.ventesParJour || stats.ventesParJour.length === 0) return [];
    
    const joursNoms = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const caParJourSemaine = [0, 0, 0, 0, 0, 0, 0];
    const countParJourSemaine = [0, 0, 0, 0, 0, 0, 0];
    
    stats.ventesParJour.forEach(v => {
      const date = new Date(v.date);
      const jour = date.getDay();
      caParJourSemaine[jour] += v.ca;
      countParJourSemaine[jour] += 1;
    });
    
    const maxCA = Math.max(...caParJourSemaine);
    
    return joursNoms.map((nom, index) => ({
      nom,
      ca: caParJourSemaine[index],
      count: countParJourSemaine[index],
      moyenne: countParJourSemaine[index] > 0 ? caParJourSemaine[index] / countParJourSemaine[index] : 0,
      pct: maxCA > 0 ? (caParJourSemaine[index] / maxCA) * 100 : 0
    }));
  }, [stats.ventesParJour]);

  // Heures de pointe
  const heuresPointe = useMemo(() => {
    if (!stats.ventesParHeure || stats.ventesParHeure.length === 0) return [];
    
    const maxCA = Math.max(...stats.ventesParHeure.map(h => h.ca));
    
    return stats.ventesParHeure.map(h => ({
      ...h,
      pct: maxCA > 0 ? (h.ca / maxCA) * 100 : 0
    }));
  }, [stats.ventesParHeure]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true);
      try {
        await onRefresh();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">📈 Performance Business</h2>
          <p className="text-stone-500">Suivi des ventes et indicateurs clés</p>
        </div>
        
        {/* Dernière sync + Refresh */}
        <div className="flex items-center gap-4">
          {lastSync && (
            <p className="text-sm text-stone-500">
              🔄 Dernière sync : {formatLastSync(lastSync)}
            </p>
          )}
          {onRefresh && (
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm font-medium flex items-center gap-2"
            >
              {isLoading ? '⏳' : '🔄'} Actualiser
            </button>
          )}
        </div>
      </div>

      {/* Alerte si pas de données */}
      {!hasVentes && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 flex items-start gap-4">
          <span className="text-3xl">🔗</span>
          <div>
            <h3 className="font-semibold text-blue-800">Synchronisation Loyverse active</h3>
            <p className="text-blue-600 text-sm mt-1">
              Les données de vente apparaîtront ici après synchronisation depuis Loyverse via Make.com.
            </p>
          </div>
        </div>
      )}

      {/* KPI principaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
          <p className="text-emerald-100 text-sm">Chiffre d'affaires</p>
          <p className="text-3xl font-bold">{stats.caTotal.toLocaleString('fr-FR', {maximumFractionDigits: 0})}</p>
          <p className="text-emerald-200 text-xs mt-1">MUR • 7 derniers jours</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <p className="text-blue-100 text-sm">Transactions</p>
          <p className="text-3xl font-bold">{stats.nbTransactions}</p>
          <p className="text-blue-200 text-xs mt-1">{stats.nbArticles} articles vendus</p>
        </div>
        
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white shadow-lg">
          <p className="text-violet-100 text-sm">Panier moyen</p>
          <p className="text-3xl font-bold">{stats.panierMoyen.toLocaleString('fr-FR', {maximumFractionDigits: 0})}</p>
          <p className="text-violet-200 text-xs mt-1">MUR / transaction</p>
        </div>
        
        {!isRestricted ? (
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
            <p className="text-amber-100 text-sm">Marge brute</p>
            <p className="text-3xl font-bold">{stats.margePct.toFixed(1)}%</p>
            <p className="text-amber-200 text-xs mt-1">{stats.margeTotal.toLocaleString('fr-FR', {maximumFractionDigits: 0})} MUR</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-stone-400 to-stone-500 rounded-xl p-5 text-white shadow-lg">
            <p className="text-stone-200 text-sm">Marge brute</p>
            <p className="text-3xl font-bold">🔒</p>
            <p className="text-stone-200 text-xs mt-1">Accès Admin requis</p>
          </div>
        )}
      </div>

      {/* Top produits et Ventes par jour */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 10 */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>🏆</span> Top 10 ventes
          </h3>
          
          {hasVentes && stats.topProduits.length > 0 ? (
            <div className="space-y-3">
              {stats.topProduits.slice(0, 10).map((prod, index) => (
                <div key={prod.nom} className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-white rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-stone-400' : index === 2 ? 'bg-amber-600' : 'bg-stone-300'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-stone-800 text-sm">{prod.nom}</p>
                      <p className="text-xs text-stone-500">{prod.quantite} vendus</p>
                    </div>
                  </div>
                  <p className="font-bold text-emerald-600">{prod.ca.toLocaleString('fr-FR', {maximumFractionDigits: 0})} MUR</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-stone-50 rounded-lg">
              <span className="text-4xl">📊</span>
              <p className="text-stone-400 mt-2">En attente de données...</p>
            </div>
          )}
        </div>

        {/* Ventes par jour de semaine */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>📅</span> Ventes par jour
          </h3>
          
          {hasVentes && joursGraphique.length > 0 ? (
            <div className="space-y-3">
              {joursGraphique.map((jour) => (
                <div key={jour.nom} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-medium text-stone-600">{jour.nom}</span>
                  <div className="flex-1 h-8 bg-stone-100 rounded-lg overflow-hidden">
                    <div 
                      className={`h-full rounded-lg flex items-center justify-end pr-2 transition-all ${
                        jour.pct > 80 ? 'bg-emerald-500' : jour.pct > 50 ? 'bg-blue-500' : jour.pct > 20 ? 'bg-amber-500' : 'bg-stone-300'
                      }`}
                      style={{ width: `${Math.max(jour.pct, 5)}%` }}
                    >
                      {jour.pct > 30 && (
                        <span className="text-white text-xs font-medium">{jour.ca.toLocaleString('fr-FR', {maximumFractionDigits: 0})}</span>
                      )}
                    </div>
                  </div>
                  {jour.pct <= 30 && jour.ca > 0 && (
                    <span className="text-xs text-stone-500 w-20 text-right">{jour.ca.toLocaleString('fr-FR', {maximumFractionDigits: 0})} MUR</span>
                  )}
                </div>
              ))}
              
              {/* Analyse */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Meilleur jour :</strong> {joursGraphique.reduce((max, j) => j.ca > max.ca ? j : max, joursGraphique[0]).nom}
                  {' • '}
                  <strong>Plus calme :</strong> {joursGraphique.filter(j => j.ca > 0).reduce((min, j) => j.ca < min.ca ? j : min, joursGraphique.filter(j => j.ca > 0)[0] || {nom: '-'}).nom}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-stone-50 rounded-lg">
              <span className="text-4xl">📅</span>
              <p className="text-stone-400 mt-2">En attente de données...</p>
            </div>
          )}
        </div>
      </div>

      {/* Heures de pointe */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <span>🕐</span> Heures de pointe
        </h3>
        
        {hasVentes && heuresPointe.length > 0 ? (
          <>
            <div className="flex items-end gap-1 h-40">
              {Array.from({length: 15}, (_, i) => i + 6).map(heure => {
                const data = heuresPointe.find(h => h.heure === heure);
                const pct = data ? data.pct : 0;
                const isPointe = pct > 70;
                
                return (
                  <div key={heure} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t transition-all ${
                        isPointe ? 'bg-emerald-500' : pct > 30 ? 'bg-blue-400' : pct > 0 ? 'bg-amber-300' : 'bg-stone-200'
                      }`}
                      style={{ height: `${Math.max(pct, 3)}%` }}
                      title={`${heure}h: ${data?.ca?.toLocaleString('fr-FR') || 0} MUR`}
                    />
                    <span className="text-xs text-stone-400 mt-1">{heure}h</span>
                  </div>
                );
              })}
            </div>
            
            {/* Légende */}
            <div className="flex gap-4 mt-4 justify-center text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Très actif</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded"></span> Actif</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-300 rounded"></span> Modéré</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-stone-200 rounded"></span> Calme</span>
            </div>
            
            {/* Analyse heures de pointe */}
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-700">
                💡 <strong>Heures de pointe :</strong> {
                  heuresPointe
                    .filter(h => h.pct > 60)
                    .sort((a, b) => b.ca - a.ca)
                    .slice(0, 3)
                    .map(h => `${h.heure}h`)
                    .join(', ') || 'À déterminer avec plus de données'
                }
              </p>
            </div>
          </>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center bg-stone-50 rounded-lg">
            <span className="text-4xl mb-2">🕐</span>
            <p className="text-stone-400">En attente de données...</p>
          </div>
        )}
      </div>

      {/* Stats catalogue */}
      <div className="bg-gradient-to-r from-stone-100 to-stone-50 rounded-xl border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <span>📦</span> Catalogue actif
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-stone-200 text-center">
            <p className="text-3xl font-bold text-amber-500">{catalogueStats.nbProduitsActifs}</p>
            <p className="text-sm text-stone-500">Produits</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200 text-center">
            <p className="text-3xl font-bold text-violet-500">{catalogueStats.nbAssemblagesActifs}</p>
            <p className="text-sm text-stone-500">Assemblages</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200 text-center">
            <p className="text-3xl font-bold text-blue-500">{catalogueStats.nbFormulesActives}</p>
            <p className="text-sm text-stone-500">Formules</p>
          </div>
        </div>
      </div>
    </div>
  );
}
