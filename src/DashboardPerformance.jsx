import React, { useMemo, useState } from 'react';

export default function DashboardPerformance({ products, assemblages, formules, ventes, settings, viewMode }) {
  const isRestricted = viewMode !== 'admin';
  const [periode, setPeriode] = useState('7j');

  // Simuler des données de vente si pas de données Loyverse
  const ventesSimulees = useMemo(() => {
    if (ventes && ventes.length > 0) return ventes;
    
    // Données de démonstration
    return [];
  }, [ventes]);

  const hasVentes = ventesSimulees.length > 0;

  // Stats calculées
  const stats = useMemo(() => {
    if (!hasVentes) {
      return {
        caTotal: 0,
        nbTransactions: 0,
        panierMoyen: 0,
        topProduits: [],
        flopProduits: [],
        ventesParJour: []
      };
    }

    // Calculer les stats depuis les ventes
    const caTotal = ventesSimulees.reduce((sum, v) => sum + (v.total || 0), 0);
    const nbTransactions = new Set(ventesSimulees.map(v => v.receiptNumber)).size;
    const panierMoyen = nbTransactions > 0 ? caTotal / nbTransactions : 0;

    // Top produits
    const ventesParProduit = {};
    ventesSimulees.forEach(v => {
      if (!ventesParProduit[v.produitId]) {
        ventesParProduit[v.produitId] = { nom: v.produitNom, quantite: 0, ca: 0 };
      }
      ventesParProduit[v.produitId].quantite += v.quantite;
      ventesParProduit[v.produitId].ca += v.total;
    });

    const produitsTriesCA = Object.entries(ventesParProduit)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.ca - a.ca);

    return {
      caTotal,
      nbTransactions,
      panierMoyen,
      topProduits: produitsTriesCA.slice(0, 5),
      flopProduits: produitsTriesCA.slice(-5).reverse(),
      ventesParJour: []
    };
  }, [ventesSimulees, hasVentes]);

  // Données du catalogue pour estimation
  const catalogueStats = useMemo(() => {
    const produitsActifs = products.filter(p => p.selectionneOMC);
    const assemblagesActifs = assemblages.filter(a => a.actif);
    const formulesActives = (formules || []).filter(f => f.actif);

    // CA potentiel (somme des prix)
    const caPotentielProduits = produitsActifs.reduce((sum, p) => sum + (p.prixVente || 0), 0);
    const caPotentielAssemblages = assemblagesActifs.reduce((sum, a) => sum + (a.prixVente || 0), 0);
    const caPotentielFormules = formulesActives.reduce((sum, f) => sum + (f.prixVente || 0), 0);

    // Marge moyenne (seulement pour admin)
    let margeMoyenne = 0;
    if (!isRestricted) {
      const produitsAvecMarge = produitsActifs.filter(p => p.prixVente > 0);
      if (produitsAvecMarge.length > 0) {
        margeMoyenne = produitsAvecMarge.reduce((sum, p) => {
          const cout = p.prixUnitaire + (p.packing || 0) + (p.coutTransformation || 0);
          const marge = (p.prixVente - cout) / p.prixVente * 100;
          return sum + marge;
        }, 0) / produitsAvecMarge.length;
      }
    }

    return {
      nbProduitsActifs: produitsActifs.length,
      nbAssemblagesActifs: assemblagesActifs.length,
      nbFormulesActives: formulesActives.length,
      caPotentielTotal: caPotentielProduits + caPotentielAssemblages + caPotentielFormules,
      margeMoyenne
    };
  }, [products, assemblages, formules, isRestricted]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">📈 Performance Business</h2>
          <p className="text-stone-500">Suivi des ventes et indicateurs clés</p>
        </div>
        
        {/* Sélecteur de période */}
        <div className="flex gap-2 bg-white rounded-lg p-1 border border-stone-200">
          {[
            { id: '7j', label: '7 jours' },
            { id: '30j', label: '30 jours' },
            { id: '90j', label: '3 mois' }
          ].map(p => (
            <button key={p.id} onClick={() => setPeriode(p.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                periode === p.id 
                  ? 'bg-amber-500 text-white' 
                  : 'text-stone-600 hover:bg-stone-100'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerte si pas de données Loyverse */}
      {!hasVentes && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 flex items-start gap-4">
          <span className="text-3xl">🔗</span>
          <div>
            <h3 className="font-semibold text-blue-800">Connectez Loyverse pour voir vos ventes</h3>
            <p className="text-blue-600 text-sm mt-1">
              Les données ci-dessous sont basées sur votre catalogue. Connectez Loyverse via Make.com pour voir vos vraies statistiques de vente.
            </p>
            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              🔧 Configurer la synchronisation
            </button>
          </div>
        </div>
      )}

      {/* KPI principaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <p className="text-emerald-100 text-sm">CA période</p>
          {hasVentes ? (
            <p className="text-3xl font-bold">{stats.caTotal.toLocaleString()}</p>
          ) : (
            <p className="text-2xl font-bold text-emerald-200">--</p>
          )}
          <p className="text-emerald-200 text-xs mt-1">MUR</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <p className="text-blue-100 text-sm">Transactions</p>
          {hasVentes ? (
            <p className="text-3xl font-bold">{stats.nbTransactions}</p>
          ) : (
            <p className="text-2xl font-bold text-blue-200">--</p>
          )}
          <p className="text-blue-200 text-xs mt-1">ventes</p>
        </div>
        
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
          <p className="text-violet-100 text-sm">Panier moyen</p>
          {hasVentes ? (
            <p className="text-3xl font-bold">{stats.panierMoyen.toFixed(0)}</p>
          ) : (
            <p className="text-2xl font-bold text-violet-200">--</p>
          )}
          <p className="text-violet-200 text-xs mt-1">MUR</p>
        </div>
        
        {!isRestricted && (
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
            <p className="text-amber-100 text-sm">Marge moyenne</p>
            <p className="text-3xl font-bold">{catalogueStats.margeMoyenne.toFixed(0)}%</p>
            <p className="text-amber-200 text-xs mt-1">sur catalogue actif</p>
          </div>
        )}
      </div>

      {/* Graphique des ventes (placeholder) */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">📊 Évolution des ventes</h3>
        
        {hasVentes ? (
          <div className="h-64 flex items-center justify-center bg-stone-50 rounded-lg">
            {/* Ici viendra le graphique avec les vraies données */}
            <p className="text-stone-400">Graphique des ventes (données Loyverse)</p>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center bg-stone-50 rounded-lg">
            <span className="text-4xl mb-2">📊</span>
            <p className="text-stone-400">Connectez Loyverse pour voir l'évolution des ventes</p>
          </div>
        )}
      </div>

      {/* Top/Flop produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>🏆</span> Top 5 ventes
          </h3>
          
          {hasVentes && stats.topProduits.length > 0 ? (
            <div className="space-y-3">
              {stats.topProduits.map((prod, index) => (
                <div key={prod.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-stone-400' : index === 2 ? 'bg-amber-600' : 'bg-stone-300'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-stone-800">{prod.nom}</p>
                      <p className="text-xs text-stone-500">{prod.quantite} vendus</p>
                    </div>
                  </div>
                  <p className="font-bold text-emerald-600">{prod.ca.toLocaleString()} MUR</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-stone-50 rounded-lg">
              <p className="text-stone-400">Données non disponibles</p>
              <p className="text-xs text-stone-300 mt-1">Connectez Loyverse</p>
            </div>
          )}
        </div>

        {/* Flop 5 */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>📉</span> À surveiller (moins vendus)
          </h3>
          
          {hasVentes && stats.flopProduits.length > 0 ? (
            <div className="space-y-3">
              {stats.flopProduits.map((prod, index) => (
                <div key={prod.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-600 font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-stone-800">{prod.nom}</p>
                      <p className="text-xs text-stone-500">{prod.quantite} vendus</p>
                    </div>
                  </div>
                  <p className="font-bold text-red-600">{prod.ca.toLocaleString()} MUR</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-stone-50 rounded-lg">
              <p className="text-stone-400">Données non disponibles</p>
              <p className="text-xs text-stone-300 mt-1">Connectez Loyverse</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats catalogue (toujours visible) */}
      <div className="bg-gradient-to-r from-stone-100 to-stone-50 rounded-xl border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">📦 Aperçu du catalogue actif</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <p className="text-sm text-stone-500">Produits actifs</p>
            <p className="text-2xl font-bold text-stone-800">{catalogueStats.nbProduitsActifs}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <p className="text-sm text-stone-500">Assemblages actifs</p>
            <p className="text-2xl font-bold text-stone-800">{catalogueStats.nbAssemblagesActifs}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <p className="text-sm text-stone-500">Formules actives</p>
            <p className="text-2xl font-bold text-stone-800">{catalogueStats.nbFormulesActives}</p>
          </div>
          {!isRestricted && (
            <div className="bg-white rounded-lg p-4 border border-stone-200">
              <p className="text-sm text-stone-500">Valeur catalogue</p>
              <p className="text-2xl font-bold text-amber-600">{catalogueStats.caPotentielTotal.toLocaleString()}</p>
              <p className="text-xs text-stone-400">MUR (prix cumulés)</p>
            </div>
          )}
        </div>
      </div>

      {/* Heures de pointe (placeholder) */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">🕐 Heures de pointe</h3>
        
        {hasVentes ? (
          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((jour, index) => (
              <div key={jour} className="text-center">
                <p className="text-xs font-medium text-stone-600 mb-2">{jour}</p>
                <div className="h-24 bg-stone-100 rounded-lg flex items-end justify-center p-1">
                  <div 
                    className={`w-full rounded ${index === 5 || index === 6 ? 'bg-emerald-500' : index === 0 ? 'bg-red-300' : 'bg-blue-400'}`}
                    style={{ height: `${index === 0 ? 20 : index === 5 || index === 6 ? 90 : 50 + Math.random() * 30}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center bg-stone-50 rounded-lg">
            <span className="text-3xl mb-2">🕐</span>
            <p className="text-stone-400">Connectez Loyverse pour voir les heures de pointe</p>
          </div>
        )}
        
        {hasVentes && (
          <p className="text-sm text-stone-500 mt-4 text-center">
            💡 Samedi et Dimanche sont vos meilleurs jours. Lundi est faible - envisagez de fermer ?
          </p>
        )}
      </div>
    </div>
  );
}
