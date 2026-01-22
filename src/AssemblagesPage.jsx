// AssemblagesPage.jsx - Section Plats Assemblés pour OMC Manager

import React, { useState, useMemo } from 'react';

// === COMPOSANTS UTILITAIRES LOCAUX ===
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-sky-100 text-sky-800',
    purple: 'bg-purple-100 text-purple-800'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const formatMUR = (value) => `${(value || 0).toFixed(2)} MUR`;

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}>
          <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-purple-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// === FORMULAIRE ASSEMBLAGE ===
const AssemblageForm = ({ assemblage, onSave, onCancel, products, settings }) => {
  const isEdit = !!assemblage?.id;
  const [form, setForm] = useState(assemblage || {
    nom: '',
    description: '',
    composants: [], // [{productId, quantite}]
    coutAssemblage: 10, // Coût main d'oeuvre assemblage
    packingType: 'Boite',
    vatApplicable: true,
    prixVente: 0,
    actif: true,
    notes: ''
  });

  // Produits disponibles (non assemblages, actifs)
  const availableProducts = products.filter(p => !p.isAssemblage);

  // Ajouter un composant
  const addComposant = () => {
    if (availableProducts.length === 0) return;
    setForm({
      ...form,
      composants: [...form.composants, { productId: availableProducts[0].id, quantite: 1 }]
    });
  };

  // Supprimer un composant
  const removeComposant = (index) => {
    setForm({
      ...form,
      composants: form.composants.filter((_, i) => i !== index)
    });
  };

  // Modifier un composant
  const updateComposant = (index, field, value) => {
    const newComposants = [...form.composants];
    newComposants[index] = { ...newComposants[index], [field]: value };
    setForm({ ...form, composants: newComposants });
  };

  // Calculs
  const packingCout = settings.packingTypes.find(p => p.nom === form.packingType)?.cout || 0;
  
  // Coût total des composants
  const coutComposants = form.composants.reduce((total, comp) => {
    const product = products.find(p => p.id === comp.productId);
    if (!product) return total;
    const prixUnit = product.lot > 0 ? product.prixFournisseur / product.lot : product.prixFournisseur;
    return total + (prixUnit * comp.quantite);
  }, 0);

  const sousTotal = coutComposants + form.coutAssemblage + packingCout;
  const vatAchat = form.vatApplicable ? sousTotal * (settings.vatRate / 100) : 0;
  const coutFinal = sousTotal + vatAchat;
  
  const vatVente = form.vatApplicable ? (form.prixVente / (1 + settings.vatRate / 100)) * (settings.vatRate / 100) : 0;
  const margeBrute = form.prixVente - coutFinal;
  const margePct = form.prixVente > 0 ? margeBrute / form.prixVente : 0;
  const margeNette = margeBrute - vatVente;

  // Prix conseillé
  const prixConseille = coutFinal * (settings.coefficientPrixConseille || 2.5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      id: form.id || `assemblage_${Date.now()}`,
      isAssemblage: true,
      coutComposants,
      coutFinal,
      margePct,
      margeMUR: margeBrute
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Identification */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
          Identification
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Nom du plat assemblé *</label>
            <input type="text" required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: Burger Complet, Salade César..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Courte description..." />
          </div>
        </div>
      </div>

      {/* Section 2: Composants */}
      <div className="bg-purple-50 rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-stone-700 flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
            Composants (Produits bruts)
          </h3>
          <button type="button" onClick={addComposant}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-1">
            <span>+</span> Ajouter
          </button>
        </div>

        {form.composants.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <p>Aucun composant ajouté</p>
            <p className="text-sm">Cliquez sur "Ajouter" pour sélectionner des produits</p>
          </div>
        ) : (
          <div className="space-y-3">
            {form.composants.map((comp, index) => {
              const product = products.find(p => p.id === comp.productId);
              const prixUnit = product && product.lot > 0 ? product.prixFournisseur / product.lot : (product?.prixFournisseur || 0);
              const sousTotal = prixUnit * comp.quantite;
              
              return (
                <div key={index} className="bg-white rounded-lg p-3 border border-purple-200 flex items-center gap-3">
                  <div className="flex-1">
                    <select value={comp.productId} onChange={e => updateComposant(index, 'productId', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm">
                      {availableProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nomOMC || p.nomFournisseur} ({formatMUR(p.lot > 0 ? p.prixFournisseur / p.lot : p.prixFournisseur)}/unité)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input type="number" min="0.1" step="0.1" value={comp.quantite}
                      onChange={e => updateComposant(index, 'quantite', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm text-center" />
                    <div className="text-xs text-stone-400 text-center mt-1">Qté</div>
                  </div>
                  <div className="w-28 text-right">
                    <div className="font-medium text-purple-700">{formatMUR(sousTotal)}</div>
                    <div className="text-xs text-stone-400">Sous-total</div>
                  </div>
                  <button type="button" onClick={() => removeComposant(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              );
            })}
            
            {/* Total composants */}
            <div className="flex justify-end pt-2 border-t border-purple-200">
              <div className="text-right">
                <span className="text-stone-600 mr-4">Total composants:</span>
                <span className="font-bold text-purple-700 text-lg">{formatMUR(coutComposants)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Coûts additionnels */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
          Coûts additionnels
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Coût assemblage (MUR)</label>
            <input type="number" min="0" value={form.coutAssemblage}
              onChange={e => setForm({...form, coutAssemblage: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
            <p className="text-xs text-stone-400 mt-1">Main d'œuvre pour l'assemblage</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Emballage</label>
            <select value={form.packingType} onChange={e => setForm({...form, packingType: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              {settings.packingTypes.map(p => (
                <option key={p.id} value={p.nom}>{p.nom} (+{p.cout} MUR)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">VAT applicable</label>
            <div className="flex items-center h-10">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={form.vatApplicable}
                  onChange={e => setForm({...form, vatApplicable: e.target.checked})}
                  className="w-5 h-5 rounded border-stone-300 text-purple-600 focus:ring-purple-500 mr-2" />
                <span className="text-sm text-stone-600">Oui ({settings.vatRate}%)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Récapitulatif des coûts */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
          Récapitulatif des coûts
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Coût composants</span>
              <span className="font-medium">{formatMUR(coutComposants)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">+ Coût assemblage</span>
              <span className="font-medium">{formatMUR(form.coutAssemblage)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">+ Emballage ({form.packingType})</span>
              <span className="font-medium">{formatMUR(packingCout)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-purple-200 pt-2">
              <span className="text-stone-600">Sous-total HT</span>
              <span className="font-medium">{formatMUR(sousTotal)}</span>
            </div>
            {form.vatApplicable && (
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">+ VAT achat ({settings.vatRate}%)</span>
                <span className="font-medium">{formatMUR(vatAchat)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-purple-300 pt-2 text-purple-700">
              <span>COÛT FINAL</span>
              <span>{formatMUR(coutFinal)}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-center mb-3">
              <span className="text-sm text-stone-500">Prix conseillé (×{settings.coefficientPrixConseille || 2.5})</span>
              <div className="text-2xl font-bold text-purple-600">{formatMUR(prixConseille)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Prix de vente et marge */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">5</span>
          Prix de vente & Marge
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Prix de vente TTC (MUR) *</label>
            <input type="number" min="0" step="5" required value={form.prixVente}
              onChange={e => setForm({...form, prixVente: parseFloat(e.target.value) || 0})}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-medium" />
            <p className="text-xs text-purple-500 mt-1">💡 Prix conseillé: {formatMUR(prixConseille)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4">
            <div className="text-sm text-stone-600 mb-2">Analyse de la marge</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Marge brute</span>
                <span className={`font-bold ${margeBrute >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatMUR(margeBrute)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Marge %</span>
                <span className={`font-bold ${margePct >= 0.5 ? 'text-emerald-600' : margePct >= 0.3 ? 'text-amber-600' : 'text-red-600'}`}>
                  {(margePct * 100).toFixed(1)}%
                </span>
              </div>
              {form.vatApplicable && (
                <div className="flex justify-between text-sm text-stone-500 pt-1 border-t border-purple-200">
                  <span>Marge nette (après VAT vente)</span>
                  <span>{formatMUR(margeNette)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Options */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">6</span>
          Options
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={form.actif}
                onChange={e => setForm({...form, actif: e.target.checked})}
                className="w-5 h-5 rounded border-stone-300 text-purple-600 focus:ring-purple-500 mr-2" />
              <span className="text-sm text-stone-700">Actif (disponible à la vente)</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Notes</label>
            <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Notes internes..." />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onCancel}
          className="px-6 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors">
          Annuler
        </button>
        <button type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium">
          {isEdit ? 'Mettre à jour' : 'Créer l\'assemblage'}
        </button>
      </div>
    </form>
  );
};

// === PAGE PRINCIPALE ASSEMBLAGES ===
const AssemblagesPage = ({ assemblages, setAssemblages, products, settings }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActif, setFilterActif] = useState('all');

  // Filtrage
  const filteredAssemblages = useMemo(() => {
    return assemblages.filter(a => {
      const matchSearch = a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchActif = filterActif === 'all' || 
                         (filterActif === 'actif' && a.actif) ||
                         (filterActif === 'inactif' && !a.actif);
      return matchSearch && matchActif;
    });
  }, [assemblages, searchTerm, filterActif]);

  // Statistiques
  const stats = useMemo(() => {
    const actifs = assemblages.filter(a => a.actif).length;
    const totalCA = assemblages.filter(a => a.actif).reduce((sum, a) => sum + (a.prixVente || 0), 0);
    const avgMarge = assemblages.length > 0 
      ? assemblages.reduce((sum, a) => sum + (a.margePct || 0), 0) / assemblages.length * 100
      : 0;
    return { total: assemblages.length, actifs, totalCA, avgMarge };
  }, [assemblages]);

  // Handlers
  const handleNew = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (assemblage) => {
    setEditingItem(assemblage);
    setShowModal(true);
  };

  const handleSave = (assemblage) => {
    if (editingItem) {
      setAssemblages(assemblages.map(a => a.id === assemblage.id ? assemblage : a));
    } else {
      setAssemblages([...assemblages, assemblage]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet assemblage ?')) {
      setAssemblages(assemblages.filter(a => a.id !== id));
    }
  };

  const handleToggleActif = (id) => {
    setAssemblages(assemblages.map(a => a.id === id ? {...a, actif: !a.actif} : a));
  };

  // Obtenir le nom du produit
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.nomOMC || product?.nomFournisseur || 'Produit inconnu';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <span className="text-3xl">🍽️</span>
            Plats Assemblés
          </h2>
          <p className="text-stone-500 text-sm">Créez des plats en combinant plusieurs produits</p>
        </div>
        <button onClick={handleNew}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium flex items-center gap-2 shadow-lg shadow-purple-200">
          <span className="text-lg">+</span>
          Nouvel assemblage
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
          <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
          <div className="text-stone-500 text-sm">Assemblages</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
          <div className="text-2xl font-bold text-emerald-600">{stats.actifs}</div>
          <div className="text-stone-500 text-sm">Actifs</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
          <div className="text-2xl font-bold text-amber-600">{stats.avgMarge.toFixed(1)}%</div>
          <div className="text-stone-500 text-sm">Marge moyenne</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
          <div className="text-2xl font-bold text-pink-600">{formatMUR(stats.totalCA)}</div>
          <div className="text-stone-500 text-sm">CA potentiel (actifs)</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input type="text" placeholder="Rechercher un assemblage..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <div className="flex gap-2">
          {['all', 'actif', 'inactif'].map(f => (
            <button key={f} onClick={() => setFilterActif(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterActif === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}>
              {f === 'all' ? 'Tous' : f === 'actif' ? '✓ Actifs' : '✗ Inactifs'}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {filteredAssemblages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-stone-200">
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-stone-700 mb-2">Aucun assemblage</h3>
          <p className="text-stone-500 mb-6">Créez votre premier plat assemblé en combinant des produits existants</p>
          <button onClick={handleNew}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            + Créer un assemblage
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAssemblages.map(assemblage => {
            const packingCout = settings.packingTypes.find(p => p.nom === assemblage.packingType)?.cout || 0;
            
            return (
              <div key={assemblage.id}
                className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md ${
                  assemblage.actif ? 'border-purple-200' : 'border-stone-200 opacity-60'
                }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-stone-800">{assemblage.nom}</h3>
                      {assemblage.actif ? (
                        <Badge variant="success">Actif</Badge>
                      ) : (
                        <Badge variant="default">Inactif</Badge>
                      )}
                    </div>
                    {assemblage.description && (
                      <p className="text-stone-500 text-sm mb-3">{assemblage.description}</p>
                    )}
                    
                    {/* Composants */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {assemblage.composants?.map((comp, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                          {comp.quantite}× {getProductName(comp.productId)}
                        </span>
                      ))}
                    </div>

                    {/* Coûts */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-stone-400">Coût composants:</span>
                        <span className="ml-1 font-medium">{formatMUR(assemblage.coutComposants)}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">+ Assemblage:</span>
                        <span className="ml-1 font-medium">{formatMUR(assemblage.coutAssemblage)}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">+ Emballage:</span>
                        <span className="ml-1 font-medium">{formatMUR(packingCout)}</span>
                      </div>
                      <div className="font-bold text-purple-700">
                        <span className="text-stone-400 font-normal">= Coût final:</span>
                        <span className="ml-1">{formatMUR(assemblage.coutFinal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prix et marge */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-700">{formatMUR(assemblage.prixVente)}</div>
                    <div className="text-sm text-stone-500">Prix de vente</div>
                    <div className={`text-lg font-bold mt-2 ${
                      (assemblage.margePct || 0) >= 0.5 ? 'text-emerald-600' : 
                      (assemblage.margePct || 0) >= 0.3 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {((assemblage.margePct || 0) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-stone-400">Marge</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleEdit(assemblage)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Modifier">
                      ✏️
                    </button>
                    <button onClick={() => handleToggleActif(assemblage.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        assemblage.actif ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={assemblage.actif ? 'Désactiver' : 'Activer'}>
                      {assemblage.actif ? '⏸️' : '▶️'}
                    </button>
                    <button onClick={() => handleDelete(assemblage.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} 
        title={editingItem ? 'Modifier l\'assemblage' : 'Nouvel assemblage'} size="lg">
        <AssemblageForm
          assemblage={editingItem}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          products={products}
          settings={settings}
        />
      </Modal>
    </div>
  );
};

export default AssemblagesPage;
