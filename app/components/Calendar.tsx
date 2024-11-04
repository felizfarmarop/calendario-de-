'use client';

import React, { useState } from 'react';

interface Collaborator {
    name: string;
    color: string;
    referenceDate: string;
    scale: string;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const calculateDaysOff = (referenceDate: string, scale: string, year: number, month: number) => {
    const daysOff: number[] = [];
    const date = new Date(referenceDate);
    const workDays = parseInt(scale.split('x')[0]);
    const restDays = parseInt(scale.split('x')[1]);

    date.setFullYear(year, month);

    let dayCounter = 0;
    while (date.getMonth() === month) {
        if (dayCounter === workDays) {
            daysOff.push(date.getDate());
            date.setDate(date.getDate() + restDays);
            dayCounter = 0;
        } else {
            dayCounter++;
            date.setDate(date.getDate() + 1);
        }
    }
    return daysOff;
};

const Calendar: React.FC<{ collaborators: Collaborator[] }> = ({ collaborators }) => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [displayType, setDisplayType] = useState<'name' | 'dot' | 'square'>('dot');

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayIndex }, () => null);
    const calendarDays = [...emptyDays, ...daysArray];

    const goToPreviousMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const goToNextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    return (
        <div className="max-w-md mx-auto border border-gray-300 rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
                <button onClick={goToPreviousMonth} className="text-gray-700 hover:text-gray-900">
                    &lt; Mês Anterior
                </button>
                <h2 className="text-lg font-semibold">{`${year} - ${month + 1}`}</h2>
                <button onClick={goToNextMonth} className="text-gray-700 hover:text-gray-900">
                    Próximo Mês &gt;
                </button>
            </div>

            <div className="flex justify-center my-4">
                <button onClick={() => setDisplayType('name')} className={`px-2 py-1 mx-1 ${displayType === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded`}>
                    Nome
                </button>
                <button onClick={() => setDisplayType('dot')} className={`px-2 py-1 mx-1 ${displayType === 'dot' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded`}>
                    Bolinhas
                </button>
                <button onClick={() => setDisplayType('square')} className={`px-2 py-1 mx-1 ${displayType === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded`}>
                    Cor Total
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 p-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-center font-medium text-gray-600">
                        {day}
                    </div>
                ))}

                {calendarDays.map((day, index) => {
                    const dayOffCollaborators = collaborators.filter(collaborator =>
                        calculateDaysOff(collaborator.referenceDate, collaborator.scale, year, month).includes(day as number)
                    );

                    return (
                        <div
                            key={index}
                            className={`relative h-16 flex items-center justify-center border rounded ${day ? 'bg-white' : 'bg-gray-50'}`}
                        >
                            {day && (
                                <>
                                    <span className="absolute top-1 left-1 text-xs font-bold text-gray-600">{day}</span>
                                    {displayType === 'name' && (
                                        <span className="text-xs font-medium">
                                            {dayOffCollaborators.map(collaborator => collaborator.name).join(', ')}
                                        </span>
                                    )}
                                    {displayType === 'dot' && (
                                        <div className="flex space-x-1">
                                            {dayOffCollaborators.map((collaborator, i) => (
                                                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: collaborator.color }} />
                                            ))}
                                        </div>
                                    )}
                                    {displayType === 'square' && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center"
                                            style={{ backgroundColor: dayOffCollaborators[0]?.color || 'transparent' }}
                                        >
                                            {dayOffCollaborators.length > 1 && (
                                                <span className="text-xs font-medium text-white">
                                                    {dayOffCollaborators.map(collaborator => collaborator.name).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
