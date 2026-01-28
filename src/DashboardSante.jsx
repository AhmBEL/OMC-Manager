import React, { useMemo } from 'react';

export default function DashboardSante({ products, assemblages, formules, fournisseurs, settings, viewMode }) {
  const isRestricted = viewMode !== 'admin';

  // Analyser les problèmes
  const analyses = useMemo(() => {
    const problemes = [];
    const avertissements = [];
    const bonnesPratiques = [];

    // === PRODUITS ===
    
    // Produits sans prix de vente
    const produitsSansPrix = products.filter(p => !p.prixVente || p.prixVente <= 0);
    if (produitsSansPrix.length > 0) {
      problemes.push({
        type: 'error',
        categorie: 'Catalogue',
        message: `${produitsSansPrix.length} produit(s) sans prix de vente`,
        details: produitsSansPrix.map(p => p.nomOMC).slice(0, 5).join(', ') + (produitsSansPrix.length > 5 ? '...' : ''),
        action: 'Définir un prix de vente pour ces produits'
      });
    }

    // Produits avec marge négative (seulement pour admin)
    if (!isRestricted) {
      const produitsMargeNegative = products.filter(p => {
        const cout = p.prixUnitaire + (p.packing || 0) + (p.coutTransformation || 0);
        return p.prixVente > 0 && p.prixVente < cout;
      });
      if (produitsMargeNegative.length > 0) {
        problemes.push({
          type: 'error',
          categorie: 'Rentabilité',
          message: `${produitsMargeNegative.length} produit(s) avec marge négative`,
          details: produitsMargeNegative.map(p => p.nomOMC).slice(0, 5).join(', '),
          action: 'Augmenter le prix de vente ou réduire les coûts'
        });
      }

      // Produits avec marge faible (<30%)
      const produitsMargesFaibles = products.filter(p => {
        if (!p.prixVente || p.prixVente <= 0) return false;
        const cout = p.prixUnitaire + (p.packing || 0) + (p.coutTransformation || 0);
        const marge = (p.prixVente - cout) / p.prixVente * 100;
        return marge > 0 && marge < 30;
      });
      if (produitsMargesFaibles.length > 0) {
        avertissements.push({
          type: 'warning',
          categorie: 'Rentabilité',
          message: `${produitsMargesFaibles.length} produit(s) avec marge faible (<30%)`,
          details: produitsMargesFaibles.map(p => p.nomOMC).slice(0, 5).join(', '),
          action: 'Envisager une révision des prix'
        });
      }
    }

    // Produits sans fournisseur
    const produitsSansFournisseur = products.filter(p => !p.fournisseur || p.fournisseur === '');
    if (produitsSansFournisseur.length > 0) {
      avertissements.push({
        type: 'warning',
        categorie: 'Catalogue',
        message: `${produitsSansFournisseur.length} produit(s) sans fournisseur assigné`,
        details: produitsSansFournisseur.map(p => p.nomOMC).slice(0, 5).join(', '),
        action: 'Assigner un fournisseur à ces produits'
      });
    }

    // Produits non synchronisés Loyverse
    const produitsNonSync = products.filter(p => !p.loyverseId && p.selectionneOMC);
    if (produitsNonSync.length > 0) {
      avertissements.push({
        type: 'warning',
        categorie: 'Sync Loyverse',
        message: `${produitsNonSync.length} produit(s) sélectionné(s) non synchronisé(s)`,
        details: produitsNonSync.map(p => p.nomOMC).slice(0, 5).join(', '),
        action: 'Synchroniser avec Loyverse'
      });
    }

    // === ASSEMBLAGES ===
    
    // Assemblages sans composants
    const assemblagesSansComposants = assemblages.filter(a => !a.composants || a.composants.length === 0);
    if (assemblagesSansComposants.length > 0) {
      problemes.push({
        type: 'error',
        categorie: 'Assemblages',
        message: `${assemblagesSansComposants.length} assemblage(s) sans composants`,
        details: assemblagesSansComposants.map(a => a.nom).join(', '),
        action: 'Ajouter des composants ou supprimer ces assemblages'
      });
    }

    // Assemblages avec composants manquants
    const assemblagesComposantsManquants = assemblages.filter(a => {
      if (!a.composants) return false;
      return a.composants.some(c => !products.find(p => p.id === c.productId));
    });
    if (assemblagesComposantsManquants.length > 0) {
      problemes.push({
        type: 'error',
        categorie: 'Assemblages',
        message: `${assemblagesComposantsManquants.length} assemblage(s) avec composant(s) introuvable(s)`,
        details: assemblagesComposantsManquants.map(a => a.nom).join(', '),
        action: 'Vérifier et corriger les composants'
      });
    }

    // Assemblages sans prix
    const assemblagesSansPrix = assemblages.filter(a => !a.prixVente || a.prixVente <= 0);
    if (assemblagesSansPrix.length > 0) {
      problemes.push({
        type: 'error',
        categorie: 'Assemblages',
        message: `${assemblagesSansPrix.length} assemblage(s) sans prix de vente`,
        details: assemblagesSansPrix.map(a => a.nom).join(', '),
        action: 'Définir un prix de vente'
      });
    }

    // === FORMULES ===
    
    // Formules avec moins de 2 composants
    const formulesIncompletes = (formules || []).filter(f => !f.composants || f.composants.length < 2);
    if (formulesIncompletes.length > 0) {
      problemes.push({
        type: 'error',
        categorie: 'Formules',
        message: `${formulesIncompletes.length} formule(s) avec moins de 2 composants`,
        details: formulesIncompletes.map(f => f.nom).join(', '),
        action: 'Une formule doit contenir au moins 2 éléments'
      });
    }

    // Formules plus chères que l'achat séparé
    const formulesNonAvantageuses = (formules || []).filter(f => 
      f.prixVente && f.prixComposants && f.prixVente >= f.prixComposants
    );
    if (formulesNonAvantageuses.length > 0) {
      avertissements.push({
        type: 'warning',
        categorie: 'Formules',
        message: `${formulesNonAvantageuses.length} formule(s) sans économie pour le client`,
        details: formulesNonAvantageuses.map(f => f.nom).join(', '),
        action: 'Le prix de la formule devrait être inférieur à l\'achat séparé'
      });
    }

    // === FOURNISSEURS ===
    
    // Fournisseurs sans produits
    const fournisseursSansProduits = fournisseurs.filter(f => 
      !products.some(p => p.fournisseur === f.nom)
    );
    if (fournisseursSansProduits.length > 0) {
      avertissements.push({
        type: 'info',
        categorie: 'Fournisseurs',
        message: `${fournisseursSansProduits.length} fournisseur(s) sans produits associés`,
        details: fournisseursSansProduits.map(f => f.nom).join(', '),
        action: 'Supprimer ou assigner des produits'
      });
    }

    // === BONNES PRATIQUES ===
    
    const produitsSelectionnes = products.filter(p => p.selectionneOMC);
    if (produitsSelectionnes.length > 0) {
      bonnesPratiques.push({
        type: 'success',
        message: `${produitsSelectionnes.length} produits sélectionnés pour la vente`
      });
    }

    const assemblagesActifs = assemblages.filter(a => a.actif);
    if (assemblagesActifs.length > 0) {
      bonnesPratiques.push({
        type: 'success',
        message: `${assemblagesActifs.length} assemblages actifs`
      });
    }

    const formulesActives = (formules || []).filter(f => f.actif);
    if (formulesActives.length > 0) {
      bonnesPratiques.push({
        type: 'success',
        message: `${formulesActives.length} formules actives`
      });
    }

    return { problemes, avertissements, bonnesPratiques };
  }, [products, assemblages, formules, fournisseurs, isRestricted]);

  // Score de santé
  const scoreTotal = analyses.problemes.length * 10 + analyses.avertissements.length * 3;
  const scoreSante = Math.max(0, 100 - scoreTotal);
  const couleurScore = scoreSante >= 80 ? 'emerald' : scoreSante >= 50 ? 'amber' : 'red';

  // Stats globales
  const stats = useMemo(() => ({
    produits: products.length,
    produitsActifs: products.filter(p => p.selectionneOMC).length,
    assemblages: assemblages.length,
    assemblagesActifs: assemblages.filter(a => a.actif).length,
    formules: (formules || []).length,
    formulesActives: (formules || []).filter(f => f.actif).length,
    fournisseurs: fournisseurs.length
  }), [products, assemblages, formules, fournisseurs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-800">🏥 Santé de la base de données</h2>
        <p className="text-stone-500">Vérification de la cohérence et des problèmes potentiels</p>
      </div>

      {/* Score de santé */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-stone-700 mb-1">Score de santé global</h3>
            <p className="text-stone-500 text-sm">
              {analyses.problemes.length} problème(s) • {analyses.avertissements.length} avertissement(s)
            </p>
          </div>
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-${couleurScore}-400 to-${couleurScore}-600 flex items-center justify-center`}>
            <span className="text-3xl font-bold text-white">{scoreSante}%</span>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-4 h-3 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-${couleurScore}-400 to-${couleurScore}-500 transition-all duration-500`}
            style={{ width: `${scoreSante}%` }}
          />
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-stone-500 text-sm">Produits</p>
          <p className="text-2xl font-bold text-stone-800">{stats.produitsActifs} <span className="text-stone-400 text-lg">/ {stats.produits}</span></p>
          <p className="text-xs text-stone-400">actifs / total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-stone-500 text-sm">Assemblages</p>
          <p className="text-2xl font-bold text-stone-800">{stats.assemblagesActifs} <span className="text-stone-400 text-lg">/ {stats.assemblages}</span></p>
          <p className="text-xs text-stone-400">actifs / total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-stone-500 text-sm">Formules</p>
          <p className="text-2xl font-bold text-stone-800">{stats.formulesActives} <span className="text-stone-400 text-lg">/ {stats.formules}</span></p>
          <p className="text-xs text-stone-400">actives / total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="text-stone-500 text-sm">Fournisseurs</p>
          <p className="text-2xl font-bold text-stone-800">{stats.fournisseurs}</p>
          <p className="text-xs text-stone-400">enregistrés</p>
        </div>
      </div>

      {/* Problèmes critiques */}
      {analyses.problemes.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-5">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">!</span>
            Problèmes à corriger ({analyses.problemes.length})
          </h3>
          <div className="space-y-3">
            {analyses.problemes.map((prob, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">{prob.categorie}</span>
                    <p className="font-medium text-stone-800 mt-1">{prob.message}</p>
                    <p className="text-sm text-stone-500 mt-1">{prob.details}</p>
                  </div>
                </div>
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  💡 {prob.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avertissements */}
      {analyses.avertissements.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">⚠</span>
            Avertissements ({analyses.avertissements.length})
          </h3>
          <div className="space-y-3">
            {analyses.avertissements.map((warn, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">{warn.categorie}</span>
                    <p className="font-medium text-stone-800 mt-1">{warn.message}</p>
                    <p className="text-sm text-stone-500 mt-1">{warn.details}</p>
                  </div>
                </div>
                <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                  💡 {warn.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tout va bien */}
      {analyses.problemes.length === 0 && analyses.avertissements.length === 0 && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-8 text-center">
          <span className="text-5xl">✨</span>
          <h3 className="text-xl font-semibold text-emerald-800 mt-4">Tout est en ordre !</h3>
          <p className="text-emerald-600 mt-2">Aucun problème détecté dans votre base de données.</p>
        </div>
      )}

      {/* Bonnes pratiques */}
      {analyses.bonnesPratiques.length > 0 && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
          <h3 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center gap-2">
            <span>✓</span> Points positifs
          </h3>
          <div className="flex flex-wrap gap-2">
            {analyses.bonnesPratiques.map((bp, index) => (
              <span key={index} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                ✓ {bp.message}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
