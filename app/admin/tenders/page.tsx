'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Plus } from 'lucide-react'

export default function AdminTenders() {
  const [tenderList, setTenderList] = useState([
    {
      id: '1',
      title: { en: 'Construction of Office Building', am: 'ሥራ ህንጻ ግንባታ', om: 'Ijaarsa Manee Hojii' },
      budget: 5000000,
      deadline: '2024-02-28',
      status: 'open',
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: { en: '', am: '', om: '' },
    budget: 0,
    deadline: new Date().toISOString().split('T')[0],
    status: 'open',
  })

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({
      title: { en: '', am: '', om: '' },
      budget: 0,
      deadline: new Date().toISOString().split('T')[0],
      status: 'open',
    })
    setShowForm(true)
  }

  const handleEdit = (tender: any) => {
    setEditingId(tender.id)
    setFormData({
      title: tender.title,
      budget: tender.budget,
      deadline: tender.deadline,
      status: tender.status,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setTenderList(tenderList.filter((t) => t.id !== id))
  }

  const handleSave = () => {
    if (editingId) {
      setTenderList(
        tenderList.map((t) =>
          t.id === editingId
            ? { ...t, title: formData.title, budget: formData.budget, deadline: formData.deadline, status: formData.status }
            : t
        )
      )
    } else {
      setTenderList([
        ...tenderList,
        {
          id: Date.now().toString(),
          title: formData.title,
          budget: formData.budget,
          deadline: formData.deadline,
          status: formData.status,
        },
      ])
    }
    setShowForm(false)
  }

  const formatCurrency = (amount: number) => {
    return `ETB ${(amount / 1000000).toFixed(1)}M`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tenders Management</h1>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Tender
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Tender' : 'Add New Tender'}
          </h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Title (English)"
                value={formData.title.en}
                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Title (Amharic)"
                value={formData.title.am}
                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, am: e.target.value } })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Title (Oromoo)"
                value={formData.title.om}
                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, om: e.target.value } })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Budget (ETB)"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="awarded">Awarded</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tenders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-secondary/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Budget</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Deadline</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenderList.map((tender) => (
                <tr key={tender.id} className="border-b hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{tender.title.en}</td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(tender.budget)}</td>
                  <td className="px-6 py-4 text-sm">{new Date(tender.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tender.status === 'open' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                      tender.status === 'closed' ? 'bg-red-500/20 text-red-700 dark:text-red-400' :
                      'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                    }`}>
                      {tender.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(tender)}
                      className="gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tender.id)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
