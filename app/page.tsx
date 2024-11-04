// pages/index.tsx
'use client';

import { useEffect, useState } from 'react';
import Calendar from './components/Calendar';

interface Collaborator {
    name: string;
    color: string;
    referenceDate: string;
    scale: string;
}

const Home: React.FC = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [newCollaborator, setNewCollaborator] = useState('');
    const [newColor, setNewColor] = useState('#000000');
    const [newReferenceDate, setNewReferenceDate] = useState('');
    const [newScale, setNewScale] = useState('5x1');

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedCollaborator, setEditedCollaborator] = useState<Collaborator | null>(null);

    useEffect(() => {
        const storedCollaborators = localStorage.getItem('collaborators');
        if (storedCollaborators) {
            setCollaborators(JSON.parse(storedCollaborators));
        }
    }, []);

    const addCollaborator = () => {
        if (newCollaborator.trim() === '') return;

        const updatedCollaborators = [
            ...collaborators,
            { name: newCollaborator, color: newColor, referenceDate: newReferenceDate, scale: newScale }
        ];
        setCollaborators(updatedCollaborators);
        localStorage.setItem('collaborators', JSON.stringify(updatedCollaborators));
        resetForm();
    };

    const removeCollaborator = (index: number) => {
        const updatedCollaborators = collaborators.filter((_, i) => i !== index);
        setCollaborators(updatedCollaborators);
        localStorage.setItem('collaborators', JSON.stringify(updatedCollaborators));
    };

    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditedCollaborator(collaborators[index]);
    };

    const saveEditedCollaborator = () => {
        if (editedCollaborator) {
            const updatedCollaborators = [...collaborators];
            updatedCollaborators[editingIndex!] = editedCollaborator;
            setCollaborators(updatedCollaborators);
            localStorage.setItem('collaborators', JSON.stringify(updatedCollaborators));
            setEditingIndex(null);
            setEditedCollaborator(null);
        }
    };

    const resetForm = () => {
        setNewCollaborator('');
        setNewColor('#000000');
        setNewReferenceDate('');
        setNewScale('5x1');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Colaboradores</h1>
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Adicionar Colaborador</h2>
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={newCollaborator}
                        onChange={(e) => setNewCollaborator(e.target.value)}
                        placeholder="Nome do colaborador"
                        className="border border-gray-300 p-2 rounded-l-md w-full"
                    />
                    <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md mx-2 w-16"
                    />
                    <input
                        type="date"
                        value={newReferenceDate}
                        onChange={(e) => setNewReferenceDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md mx-2"
                    />
                    <select
                        value={newScale}
                        onChange={(e) => setNewScale(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md mx-2"
                    >
                        <option value="5x1">5x1</option>
                        <option value="5x2">5x2</option>
                        <option value="6x1">6x1</option>
                    </select>
                    <button
                        onClick={addCollaborator}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Adicionar
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">Nome</th>
                                <th className="border px-4 py-2">Cor</th>
                                <th className="border px-4 py-2">Data de Referência</th>
                                <th className="border px-4 py-2">Escala</th>
                                <th className="border px-4 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collaborators.map((collaborator, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">
                                        {editingIndex === index ? (
                                            <input
                                                type="text"
                                                value={editedCollaborator?.name || ''}
                                                onChange={(e) =>
                                                    setEditedCollaborator({
                                                        ...editedCollaborator!,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="border p-1 rounded-md w-full"
                                            />
                                        ) : (
                                            collaborator.name
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {editingIndex === index ? (
                                            <input
                                                type="color"
                                                value={editedCollaborator?.color || ''}
                                                onChange={(e) =>
                                                    setEditedCollaborator({
                                                        ...editedCollaborator!,
                                                        color: e.target.value,
                                                    })
                                                }
                                                className="w-16"
                                            />
                                        ) : (
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{ backgroundColor: collaborator.color }}
                                            />
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {editingIndex === index ? (
                                            <input
                                                type="date"
                                                value={editedCollaborator?.referenceDate || ''}
                                                onChange={(e) =>
                                                    setEditedCollaborator({
                                                        ...editedCollaborator!,
                                                        referenceDate: e.target.value,
                                                    })
                                                }
                                                className="border p-1 rounded-md"
                                            />
                                        ) : (
                                            collaborator.referenceDate
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {editingIndex === index ? (
                                            <select
                                                value={editedCollaborator?.scale || ''}
                                                onChange={(e) =>
                                                    setEditedCollaborator({
                                                        ...editedCollaborator!,
                                                        scale: e.target.value,
                                                    })
                                                }
                                                className="border p-1 rounded-md"
                                            >
                                                <option value="5x1">5x1</option>
                                                <option value="5x2">5x2</option>
                                                <option value="6x1">6x1</option>
                                            </select>
                                        ) : (
                                            collaborator.scale
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {editingIndex === index ? (
                                            <button
                                                onClick={saveEditedCollaborator}
                                                className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
                                            >
                                                Salvar
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEditing(index)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition mr-2"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => removeCollaborator(index)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                                                >
                                                    Remover
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8">
                <Calendar collaborators={collaborators} />
            </div>
        </div>
    );
};

export default Home;
