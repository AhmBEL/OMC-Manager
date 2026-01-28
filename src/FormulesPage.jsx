import React, { useState, useMemo } from 'react';

// === COMPOSANT FORMULAIRE FORMULE ===
const FormuleForm = ({ formule, onSave, onCancel, products, assemblages, settings }) => {
  const [form, setForm] = useState(formule || {
    id: '',
    nom: '',
    description: '',
    composants: [],
    prixComposants: 0,
    prixVente: 0,
    economiePct: 0,
    actif: true,
    notes: ''
  });

  const [selectedType, setSelectedType] = useState('produit');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedQuantite, setSelectedQuantite] = useState(1);

  // Liste des produits vendables (avec prix de vente > 0)
  const produitsVendables = useMemo(() => 
    products.filter(p => p.prixVente > 0 && p.selectionneOMC),
    [products]
  );

  // Assemblages actifs
  const assemblagesActifs = useMemo(() => 
    assemblages.filter(a => a.actif),
    [assemblages]
  );

  // Calculer le prix total des composants
  const calculerPrixComposants = (composants) => {
    return composants.reduce((total, comp) => {
      let prix = 0;
      if (comp.type === 'produit') {
        const produit = products.find(p => p.id === comp.id);
        prix = produit ? produit.prixVente * comp.quantite : 0;
      } else if (comp.type === 'assemblage') {
        const assemblage = assemblages.find(a => a.id === comp.id);
        prix = assemblage ? assemblage.prixVente * comp.quantite : 0;
      }
      return total + prix;
    }, 0);
  };

  // Ajouter un composant
  const ajouterComposant = () => {
    if (!selectedItemId) return;
    
    const existe = form.composants.find(c => c.id === selectedItemId && c.type === selectedType);
    if (existe) {
      // Mettre à jour la quantité
      const newComposants = form.composants.map(c => 
        c.id === selectedItemId && c.type === selectedType
          ? { ...c, quantite: c.quantite + selectedQuantite }
          : c
      );
      const prixComposants = calculerPrixComposants(newComposants);
      setForm({ ...form, composants: newComposants, prixComposants });
    } else {
      const newComposants = [...form.composants, { type: selectedType, id: selectedItemId, quantite: selectedQuantite }];
      const prixComposants = calculerPrixComposants(newComposants);
      setForm({ ...form, composants: newComposants, prixComposants });
    }
    setSelectedItemId('');
    setSelectedQuantite(1);
  };

  // Supprimer un composant
  const supprimerComposant = (index) => {
    const newComposants = form.composants.filter((_, i) => i !== index);
    const prixComposants = calculerPrixComposants(newComposants);
    setForm({ ...form, composants: newComposants, prixComposants });
  };

  // Modifier quantité
  const modifierQuantite = (index, delta) => {
    const newComposants = form.composants.map((c, i) => {
      if (i === index) {
        const newQte = Math.max(0.25, c.quantite + delta);
        return { ...c, quantite: newQte };
      }
      return c;
    });
    const prixComposants = calculerPrixComposants(newComposants);
    setForm({ ...form, composants: newComposants, prixComposants });
  };

  // Obtenir les infos d'un composant
  const getComposantInfo = (comp) => {
    if (comp.type === 'produit') {
      const produit = products.find(p => p.id === comp.id);
      return produit ? { nom: produit.nomOMC, prix: produit.prixVente, emoji: '🛒' } : null;
    } else {
      const assemblage = assemblages.find(a => a.id === comp.id);
      return assemblage ? { nom: assemblage.nom, prix: assemblage.prixVente, emoji: '🍔' } : null;
    }
  };

  // Calculer l'économie
  const economiePct = form.prixComposants > 0 
    ? ((form.prixComposants - form.prixVente) / form.prixComposants * 100)
    : 0;

  // Prix suggéré (10% de réduction)
  const prixSuggere = Math.round(form.prixComposants * 0.9);

  const handleSubmit = () => {
    if (!form.nom.trim() || form.composants.length < 2) return;
    
    const id = form.id || `formule_${Date.now()}`;
    onSave({
      ...form,
      id,
      economiePct: economiePct > 0 ? economiePct : 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Identification */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
          Identification
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nom de la formule *</label>
            <input type="text" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})}
              placeholder="Ex: Menu Burger Complet"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Description de la formule..."
              rows={2}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      {/* Section 2: Composants */}
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-5 border border-cyan-100">
        <h3 className="text-sm font-semibold text-cyan-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
          Composants de la formule (min. 2)
        </h3>
        
        {/* Ajouter un composant */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <select value={selectedType} onChange={e => { setSelectedType(e.target.value); setSelectedItemId(''); }}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm">
            <option value="produit">🛒 Produit</option>
            <option value="assemblage">🍔 Assemblage</option>
          </select>
          
          <select value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-stone-300 rounded-lg text-sm">
            <option value="">Sélectionner...</option>
            {selectedType === 'produit' && produitsVendables.map(p => (
              <option key={p.id} value={p.id}>{p.nomOMC} - {p.prixVente} MUR</option>
            ))}
            {selectedType === 'assemblage' && assemblagesActifs.map(a => (
              <option key={a.id} value={a.id}>{a.nom} - {a.prixVente} MUR</option>
            ))}
          </select>
          
          <div className="flex items-center gap-1">
            <button onClick={() => setSelectedQuantite(Math.max(0.25, selectedQuantite - 0.25))}
              className="w-8 h-8 bg-stone-200 rounded hover:bg-stone-300 text-lg">-</button>
            <input type="number" value={selectedQuantite} onChange={e => setSelectedQuantite(Number(e.target.value))}
              className="w-16 px-2 py-1 border border-stone-300 rounded text-center text-sm" step="0.25" min="0.25" />
            <button onClick={() => setSelectedQuantite(selectedQuantite + 0.25)}
              className="w-8 h-8 bg-stone-200 rounded hover:bg-stone-300 text-lg">+</button>
          </div>
          
          <button onClick={ajouterComposant} disabled={!selectedItemId}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
            + Ajouter
          </button>
        </div>

        {/* Liste des composants */}
        {form.composants.length === 0 ? (
          <p className="text-stone-500 text-sm italic text-center py-4">
            Ajoutez au moins 2 composants pour créer une formule
          </p>
        ) : (
          <div className="space-y-2">
            {form.composants.map((comp, index) => {
              const info = getComposantInfo(comp);
              if (!info) return null;
              const sousTotal = info.prix * comp.quantite;
              
              return (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-cyan-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{info.emoji}</span>
                    <div>
                      <p className="font-medium text-stone-800">{info.nom}</p>
                      <p className="text-xs text-stone-500">{info.prix} MUR × {comp.quantite}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => modifierQuantite(index, -0.25)}
                        className="w-6 h-6 bg-stone-100 rounded hover:bg-stone-200 text-sm">-</button>
                      <span className="w-10 text-center text-sm">{comp.quantite}</span>
                      <button onClick={() => modifierQuantite(index, 0.25)}
                        className="w-6 h-6 bg-stone-100 rounded hover:bg-stone-200 text-sm">+</button>
                    </div>
                    <span className="font-semibold text-cyan-700 w-24 text-right">{sousTotal.toFixed(0)} MUR</span>
                    <button onClick={() => supprimerComposant(index)}
                      className="text-red-500 hover:text-red-700 p-1">✕</button>
                  </div>
                </div>
              );
            })}
            
            {/* Total composants */}
            <div className="flex justify-end pt-2 border-t border-cyan-200">
              <div className="text-right">
                <p className="text-sm text-stone-500">Prix si achat séparé</p>
                <p className="text-xl font-bold text-cyan-700">{form.prixComposants.toFixed(0)} MUR</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Prix et économie */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
          Prix de la formule
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Prix de vente (MUR) *</label>
            <input type="number" value={form.prixVente} onChange={e => setForm({...form, prixVente: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold" />
            {prixSuggere > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                💡 Prix suggéré (-10%) : <button onClick={() => setForm({...form, prixVente: prixSuggere})} className="underline font-semibold">{prixSuggere} MUR</button>
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-stone-500 mb-1">Économie pour le client</p>
            {form.prixVente > 0 && form.prixComposants > 0 ? (
              <>
                <p className={`text-2xl font-bold ${economiePct > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {economiePct > 0 ? '-' : '+'}{Math.abs(economiePct).toFixed(0)}%
                </p>
                <p className="text-sm text-stone-500">
                  {economiePct > 0 
                    ? `Économie de ${(form.prixComposants - form.prixVente).toFixed(0)} MUR`
                    : `⚠️ Plus cher que l'achat séparé !`
                  }
                </p>
              </>
            ) : (
              <p className="text-stone-400">Définir le prix de vente</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Options */}
      <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
        <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-stone-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
          Options
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.actif} onChange={e => setForm({...form, actif: e.target.checked})}
                className="sr-only peer" />
              <div className="w-11 h-6 bg-stone-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
            <span className="text-sm font-medium text-stone-700">Formule active</span>
          </div>
          
          <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
            placeholder="Notes..."
            className="flex-1 ml-4 px-3 py-2 border border-stone-300 rounded-lg text-sm" />
        </div>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button onClick={onCancel}
          className="px-6 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50">
          Annuler
        </button>
        <button onClick={handleSubmit}
          disabled={!form.nom.trim() || form.composants.length < 2 || !form.prixVente}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
          {formule ? 'Modifier' : 'Créer la formule'}
        </button>
      </div>
    </div>
  );
};

// === PAGE PRINCIPALE FORMULES ===
export default function FormulesPage({ formules, setFormules, products, assemblages, settings, viewMode }) {
  const [showModal, setShowModal] = useState(false);
  const [editingFormule, setEditingFormule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActif, setFilterActif] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isRestricted = viewMode !== 'admin';

  // Filtrage
  const formulesFiltrees = useMemo(() => {
    return formules.filter(f => {
      const matchSearch = f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchActif = filterActif === 'all' || 
                        (filterActif === 'actif' && f.actif) ||
                        (filterActif === 'inactif' && !f.actif);
      return matchSearch && matchActif;
    });
  }, [formules, searchTerm, filterActif]);

  // Stats
  const stats = useMemo(() => ({
    total: formules.length,
    actives: formules.filter(f => f.actif).length,
    economieMoyenne: formules.length > 0 
      ? formules.reduce((sum, f) => sum + (f.economiePct || 0), 0) / formules.length 
      : 0,
    caPotentiel: formules.filter(f => f.actif).reduce((sum, f) => sum + (f.prixVente || 0), 0)
  }), [formules]);

  // Obtenir les noms des composants
  const getComposantsDisplay = (formule) => {
    return formule.composants.map(c => {
      if (c.type === 'produit') {
        const p = products.find(prod => prod.id === c.id);
        return p ? p.nomOMC : '?';
      } else {
        const a = assemblages.find(ass => ass.id === c.id);
        return a ? a.nom : '?';
      }
    }).join(' + ');
  };

  const handleSave = (formule) => {
    if (editingFormule) {
      setFormules(formules.map(f => f.id === formule.id ? formule : f));
    } else {
      setFormules([...formules, formule]);
    }
    setShowModal(false);
    setEditingFormule(null);
  };

  const handleDelete = (id) => {
    setFormules(formules.filter(f => f.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActif = (id) => {
    setFormules(formules.map(f => f.id === id ? {...f, actif: !f.actif} : f));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">🍱 Formules</h2>
          <p className="text-stone-500">Combos et menus groupés</p>
        </div>
        {!isRestricted && (
          <button onClick={() => { setEditingFormule(null); setShowModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 font-medium shadow-lg shadow-blue-500/25">
            <span className="text-lg">+</span> Nouvelle formule
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-blue-100 text-sm">Total formules</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white">
          <p className="text-cyan-100 text-sm">Actives</p>
          <p className="text-3xl font-bold">{stats.actives}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-emerald-100 text-sm">Économie moyenne</p>
          <p className="text-3xl font-bold">{stats.economieMoyenne.toFixed(0)}%</p>
        </div>
        {!isRestricted && (
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-4 text-white">
            <p className="text-violet-100 text-sm">CA potentiel</p>
            <p className="text-3xl font-bold">{stats.caPotentiel.toLocaleString()}</p>
            <p className="text-violet-200 text-xs">MUR</p>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input type="text" placeholder="🔍 Rechercher une formule..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg" />
        </div>
        <div className="flex gap-2">
          {['all', 'actif', 'inactif'].map(filter => (
            <button key={filter} onClick={() => setFilterActif(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterActif === filter 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}>
              {filter === 'all' ? 'Toutes' : filter === 'actif' ? '✓ Actives' : '○ Inactives'}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des formules */}
      {formulesFiltrees.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl border-2 border-dashed border-stone-300">
          <p className="text-5xl mb-4">🍱</p>
          <p className="text-stone-500">Aucune formule trouvée</p>
          {!isRestricted && (
            <button onClick={() => { setEditingFormule(null); setShowModal(true); }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Créer votre première formule
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formulesFiltrees.map(formule => (
            <div key={formule.id} className={`bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
              formule.actif ? 'border-blue-200' : 'border-stone-200 opacity-60'
            }`}>
              {/* Header carte */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{formule.nom}</h3>
                    <p className="text-blue-100 text-sm">{formule.composants.length} éléments</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formule.actif ? 'bg-white/20 text-white' : 'bg-stone-500 text-white'
                  }`}>
                    {formule.actif ? '✓ Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              {/* Contenu */}
              <div className="p-4 space-y-3">
                <p className="text-sm text-stone-600 line-clamp-2">
                  {getComposantsDisplay(formule)}
                </p>
                
                <div className="flex justify-between items-end">
                  <div>
                    {!isRestricted && (
                      <p className="text-xs text-stone-400 line-through">{formule.prixComposants} MUR</p>
                    )}
                    <p className="text-2xl font-bold text-blue-600">{formule.prixVente} MUR</p>
                  </div>
                  {formule.economiePct > 0 && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                      -{formule.economiePct.toFixed(0)}%
                    </span>
                  )}
                </div>
                
                {/* Actions */}
                {!isRestricted && (
                  <div className="flex gap-2 pt-3 border-t border-stone-100">
                    <button onClick={() => toggleActif(formule.id)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                        formule.actif 
                          ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}>
                      {formule.actif ? 'Désactiver' : 'Activer'}
                    </button>
                    <button onClick={() => { setEditingFormule(formule); setShowModal(true); }}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
                      Modifier
                    </button>
                    <button onClick={() => setDeleteConfirm(formule.id)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg">
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal création/édition */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <h2 className="text-xl font-bold">
                  {editingFormule ? '✏️ Modifier la formule' : '🍱 Nouvelle formule'}
                </h2>
              </div>
              <div className="p-6">
                <FormuleForm
                  formule={editingFormule}
                  onSave={handleSave}
                  onCancel={() => { setShowModal(false); setEditingFormule(null); }}
                  products={products}
                  assemblages={assemblages}
                  settings={settings}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-stone-900/60" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-800 mb-2">Supprimer cette formule ?</h3>
            <p className="text-stone-600 mb-4">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50">
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
