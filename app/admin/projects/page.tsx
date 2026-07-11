'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Plus } from 'lucide-react'

export default function AdminProjects() {
  const [projectList, setProjectList] = useState([
    {
      id: '1',
      title: { en: 'Addis Ababa Business Complex', am: 'አዲስ አበባ ቢዝነስ ውስጃ', om: 'Addis Ababa Daldalaa Walguda' },
      location: { en: 'Addis Ababa, Ethiopia', am: 'አዲስ አበባ, ኢትዮጵያ', om: 'Addis Ababa, Itoophiyaa' },
      status: 'ongoing',
      date: '2022-01-15',
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: { en: '', am: '', om: '' },
    location: { en: '', am: '', om: '' },
    status: 'ongoing',
    date: new Date().toISOString().split('T')[0],
  })

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({
      title: { en: '', am: '', om: '' },
      location: { en: '', am: '', om: '' },
      status: 'ongoing',
      date: new Date().toISOString().split('T')[0],
    })
    setShowForm(true)
  }

  const handleEdit = (project: any) => {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      location: project.location,
      status: project.status,
      date: project.date,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setProjectList(projectList.filter((p) => p.id !== id))
  }

  const handleSave = () => {
    if (editingId) {
      setProjectList(
        projectList.map((p) =>
          p.id === editingId
            ? { ...p, title: formData.title, location: formData.location, status: formData.status, date: formData.date }
            : p
        )
      )
    } else {
      setProjectList([
        ...projectList,
        {
          id: Date.now().toString(),
          title: formData.title,
          location: formData.location,
          status: formData.status,
          date: formData.date,
        },
      ])
    }
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Project' : 'Add New Project'}
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
                type="text"
                placeholder="Location (English)"
                value={formData.location.en}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, en: e.target.value } })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Location (Amharic)"
                value={formData.location.am}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, am: e.target.value } })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Location (Oromoo)"
                value={formData.location.om}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, om: e.target.value } })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
              </select>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
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

      {/* Projects Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-secondary/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectList.map((project) => (
                <tr key={project.id} className="border-b hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{project.title.en}</td>
                  <td className="px-6 py-4 text-sm">{project.location.en}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'completed' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                      project.status === 'ongoing' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                      'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(project.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
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
