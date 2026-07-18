"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import { Landmark, Plus, Edit, Trash2, X, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';

interface DarshanType {
  name: string;
  price: number;
  description?: string;
}

interface Temple {
  _id: string;
  name: string;
  location: string;
  state: string;
  description: string;
  images: string[];
  timings: string;
  darshanTypes: DarshanType[];
}

export default function AdminTemplesPage() {
  const { showToast } = useToast();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemple, setEditingTemple] = useState<Temple | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      location: '',
      state: '',
      description: '',
      timings: '6:00 AM - 7:00 PM',
      imagesStr: '',
      darshanTypes: [{ name: 'General Darshan', price: 0, description: 'Standard Entry pass' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'darshanTypes'
  });

  const fetchTemples = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/temples');
      if (res.data && res.data.success) {
        setTemples(res.data.data);
      }
    } catch (err) {
      showToast('Error fetching temples list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const openAddModal = () => {
    setEditingTemple(null);
    reset({
      name: '',
      location: '',
      state: '',
      description: '',
      timings: '6:00 AM - 7:00 PM',
      imagesStr: '',
      darshanTypes: [{ name: 'General Darshan', price: 0, description: 'Standard Entry pass' }]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (temple: Temple) => {
    setEditingTemple(temple);
    reset({
      name: temple.name,
      location: temple.location,
      state: temple.state,
      description: temple.description,
      timings: temple.timings,
      imagesStr: temple.images.join(', '),
      darshanTypes: temple.darshanTypes
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (templeId: string) => {
    if (!window.confirm('Are you sure you want to delete this temple? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/api/temples/${templeId}`);
      if (res.data && res.data.success) {
        showToast('Temple deleted successfully', 'success');
        fetchTemples();
      }
    } catch (err) {
      showToast('Failed to delete temple', 'error');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      
      // Parse images string back to array of URLs
      const images = data.imagesStr
        ? data.imagesStr.split(',').map((img: string) => img.trim()).filter(Boolean)
        : [];

      // Format payload
      const payload = {
        name: data.name,
        location: data.location,
        state: data.state,
        description: data.description,
        timings: data.timings,
        images,
        darshanTypes: data.darshanTypes
      };

      let res;
      if (editingTemple) {
        // Update
        res = await api.put(`/api/temples/${editingTemple._id}`, payload);
      } else {
        // Create
        res = await api.post('/api/temples', payload);
      }

      if (res.data && res.data.success) {
        showToast(
          editingTemple ? 'Temple updated successfully' : 'Temple added successfully',
          'success'
        );
        setIsModalOpen(false);
        fetchTemples();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error occurred while saving temple';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-divine-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-spiritual-maroon">Manage Temples</h1>
          <p className="text-xs text-gray-500 font-serif">Add, update, or remove temple listings in the directory</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-sacred-saffron hover:bg-spiritual-maroon text-warm-cream border border-divine-gold/40 px-4 py-2 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Temple</span>
        </button>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-sacred-saffron animate-spin" />
          <p className="text-xs text-gray-500 font-serif">Loading temple listings...</p>
        </div>
      ) : temples.length === 0 ? (
        <div className="bg-sand p-12 text-center rounded-xl border border-dashed border-divine-gold/30">
          <p className="text-gray-500 font-serif mb-4">No temples available. Add one using the button above.</p>
        </div>
      ) : (
        <div className="bg-sand rounded-xl border border-divine-gold/30 overflow-hidden shadow-md">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-spiritual-maroon text-warm-cream border-b border-divine-gold/30">
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Image</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Name</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Location</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Timings</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Pass Categories</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divine-gold/15">
              {temples.map((temple) => (
                <tr key={temple._id} className="hover:bg-warm-cream/50 transition-colors">
                  <td className="p-4">
                    <img
                      src={temple.images[0] || 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=800&auto=format&fit=crop'}
                      alt={temple.name}
                      className="w-12 h-12 object-cover rounded border border-divine-gold/30"
                    />
                  </td>
                  <td className="p-4 font-display font-bold text-gray-800">{temple.name}</td>
                  <td className="p-4 font-serif text-gray-700">{temple.location}, {temple.state}</td>
                  <td className="p-4 text-xs font-semibold text-spiritual-maroon">{temple.timings}</td>
                  <td className="p-4 font-serif text-xs text-gray-600">
                    {temple.darshanTypes.map((d) => `${d.name} (₹${d.price})`).join(', ')}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(temple)}
                      className="text-gray-500 hover:text-sacred-saffron transition-colors inline-block"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(temple._id)}
                      className="text-gray-500 hover:text-red-600 transition-colors inline-block"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-sand border-2 border-divine-gold rounded-xl shadow-2xl max-w-2xl w-full my-8 flex flex-col relative max-h-[85vh]">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 bg-white/90 hover:bg-white text-gray-700 border border-divine-gold/30 p-1 rounded-full shadow transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="bg-spiritual-maroon text-warm-cream py-4 text-center border-b border-divine-gold/40">
              <h2 className="font-display text-base font-bold tracking-wider uppercase">
                {editingTemple ? 'Edit Temple Details' : 'Add New Temple'}
              </h2>
            </div>

            {/* Content Area */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Temple Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Temple name is required' })}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron"
                    placeholder="Kedarnath Temple"
                  />
                  {errors.name && <span className="text-xs text-red-600 font-serif">{errors.name.message}</span>}
                </div>

                {/* Timings */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Timings</label>
                  <input
                    type="text"
                    {...register('timings', { required: 'Timings are required' })}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron"
                    placeholder="6:00 AM - 7:00 PM"
                  />
                  {errors.timings && <span className="text-xs text-red-600 font-serif">{errors.timings.message}</span>}
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Location City/Town</label>
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron"
                    placeholder="Rudraprayag District"
                  />
                  {errors.location && <span className="text-xs text-red-600 font-serif">{errors.location.message}</span>}
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">State</label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron"
                    placeholder="Uttarakhand"
                  />
                  {errors.state && <span className="text-xs text-red-600 font-serif">{errors.state.message}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase">Description</label>
                <textarea
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron font-serif text-sm"
                  placeholder="History, features and pilgrim facilities..."
                />
                {errors.description && <span className="text-xs text-red-600 font-serif">{errors.description.message}</span>}
              </div>

              {/* Images string */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase">Image URLs (comma separated)</label>
                <textarea
                  rows={2}
                  {...register('imagesStr')}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron text-xs"
                  placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                />
              </div>

              {/* Darshan Types dynamic list */}
              <div className="space-y-3 pt-2 border-t border-divine-gold/15">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-spiritual-maroon uppercase tracking-wider">
                    Darshan Categories
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ name: '', price: 0, description: '' })}
                    className="text-xs font-semibold text-sacred-saffron hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Package</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-40 overflow-y-auto p-1 bg-warm-cream/50 border border-divine-gold/15 rounded">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center bg-sand p-2.5 rounded border border-divine-gold/10">
                      <input
                        type="text"
                        placeholder="Package Name (e.g. VIP Darshan)"
                        {...register(`darshanTypes.${index}.name` as const, { required: 'Name is required' })}
                        className="bg-warm-cream border border-divine-gold/30 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-sacred-saffron"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        {...register(`darshanTypes.${index}.price` as const, {
                          valueAsNumber: true,
                          required: 'Price is required'
                        })}
                        className="bg-warm-cream border border-divine-gold/30 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-sacred-saffron text-center font-bold"
                      />
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Quick description"
                          {...register(`darshanTypes.${index}.description` as const)}
                          className="w-full bg-warm-cream border border-divine-gold/30 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-sacred-saffron"
                        />
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit buttons */}
              <div className="border-t border-divine-gold/20 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-150 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-sacred-saffron hover:bg-spiritual-maroon disabled:bg-gray-300 text-warm-cream border border-divine-gold/30 font-semibold px-5 py-2.5 rounded text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Temple</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
