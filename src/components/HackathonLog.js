import React, { useState, useEffect } from 'react';
import hackathonService from '../services/hackathonService';
import { getSocket } from '../services/socketService';
import { Plus, Calendar, Users, Trophy, Bell, Clock, AlertTriangle, Trash2, Edit2, CheckCircle, X, Save } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

function HackathonLog() {
    const [hackathons, setHackathons] = useState([]);


  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [editingHackathon, setEditingHackathon] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);

  const [newHackathon, setNewHackathon] = useState({
    name: '',
    startDate: '',
    endDate: '',
    teamName: '',
    teamMembers: '',
    projectIdea: '',
    status: 'registered'
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'milestone',
    completed: false
  });


  useEffect(() => {
    const fetchHackathons = async () => {
    try {
      console.log('Fetching hackathons...');
      const data = await hackathonService.getHackathons();
      console.log('Received hackathons data:', data);
      if (data && data.hackathons && Array.isArray(data.hackathons)) {
        const mappedHackathons = data.hackathons.map(h => ({...h, id: h._id}));
        console.log('Mapped hackathons with events:', mappedHackathons);
        setHackathons(mappedHackathons);
      } else {
        console.warn('Invalid hackathons data received:', data);
        setHackathons([]);
      }
    } catch (err) {
      console.error('Failed to fetch hackathons', err);
      setHackathons([]);
    }
  };

    fetchHackathons();

    let socket;
    try {
      socket = getSocket();
      socket.on('hackathon-created', (newHackathon) => {
        if (newHackathon && newHackathon._id) {
          setHackathons(prev => [...prev, {...newHackathon, id: newHackathon._id}]);
        }
      });
      socket.on('hackathon-updated', (updatedHackathon) => {
        if (updatedHackathon && updatedHackathon._id) {
          setHackathons(prev => prev.map(h => h.id === updatedHackathon._id ? {...updatedHackathon, id: updatedHackathon._id} : h));
        }
      });
      socket.on('hackathon-deleted', ({ hackathonId }) => {
        if (hackathonId) {
          setHackathons(prev => prev.filter(h => h.id !== hackathonId));
        }
      });

      socket.on('hackathon-event-added', ({ hackathonId, event }) => {
        if (hackathonId && event) {
          setHackathons(prev => prev.map(h => {
            if (h.id === hackathonId) {
              const newEvents = h.events ? [...h.events, event] : [event];
              return { ...h, events: newEvents };
            }
            return h;
          }));
        }
      });

      socket.on('hackathon-event-updated', ({ hackathonId, event }) => {
        console.log('Received event update via socket:', { hackathonId, event });
        if (hackathonId && event) {
          setHackathons(prev => prev.map(h => {
            if (h.id === hackathonId) {
              const updatedEvents = h.events?.map(e => 
                e._id === event._id ? { ...e, ...event } : e
              ) || [];
              return { ...h, events: updatedEvents };
            }
            return h;
          }));
        }
      });
    } catch (err) {
      console.error('Failed to initialize hackathon socket connection:', err);
    }

    return () => {
      if (socket) {
        socket.off('hackathon-created');
        socket.off('hackathon-updated');
        socket.off('hackathon-deleted');
        socket.off('hackathon-event-added');
        socket.off('hackathon-event-updated');
      }
    };
  }, []);

  const addHackathon = async () => {
    console.log('addHackathon called with:', newHackathon);
    if (newHackathon.name.trim() && newHackathon.startDate && newHackathon.endDate) {
      try {
        const hackathonData = {
          ...newHackathon,
          teamMembers: newHackathon.teamMembers.split(',').map(member => member.trim()).filter(Boolean),
        };
        console.log('Sending hackathon data:', hackathonData);
        const response = await hackathonService.createHackathon(hackathonData);
        console.log('Received response:', response);
        if (response && response.hackathon && response.hackathon._id) {
          console.log('Adding hackathon to list:', response.hackathon);
          // Add the new hackathon to the list
          setHackathons(prevHackathons => [...prevHackathons, {...response.hackathon, id: response.hackathon._id}]);
        } else {
          console.error('Invalid hackathon response format:', response);
          alert('Failed to add hackathon. Invalid response format.');
        }
        setShowAddForm(false);
        setNewHackathon({ name: '', startDate: '', endDate: '', teamName: '', teamMembers: '', projectIdea: '', status: 'registered' });
      } catch (err) {
        console.error('Failed to add hackathon', err);
        alert('Failed to add hackathon: ' + (err.response?.data?.message || err.message));
      }
    } else {
      alert('Please fill in all required fields (name, start date, end date).');
    }
  };

  const addEvent = async () => {
    console.log('addEvent called with:', { newEvent, selectedHackathon });
    if (newEvent.title.trim() && newEvent.date && selectedHackathon) {
      try {
        console.log('Adding event to hackathon:', selectedHackathon.id, newEvent);
        const response = await hackathonService.addEvent(selectedHackathon.id, newEvent);
        console.log('Received addEvent response:', response);
        if (response && response.hackathon && response.hackathon._id) {
          const updatedHackathon = response.hackathon;
          console.log('Updating hackathon in list:', updatedHackathon);
          setHackathons(prevHackathons =>
            prevHackathons.map(h =>
              h.id === updatedHackathon._id
                ? { ...updatedHackathon, id: updatedHackathon._id }
                : h
            )
          );
          setShowEventForm(false);
          setSelectedHackathon(null);
          setNewEvent({ title: '', description: '', date: '', time: '', type: 'milestone', completed: false });
        } else {
          console.error('Invalid response from addEvent:', response);
          alert('Failed to add event. Invalid response from server.');
        }
      } catch (err) {
        console.error('Failed to add event:', err);
        alert('Failed to add event: ' + (err.response?.data?.message || err.message));
      }
    } else {
      alert('Please fill in all required fields (title, date) and select a hackathon.');
    }
  };

  const toggleEventCompletion = async (hackathonId, eventId) => {
    console.log('Toggling event completion:', { hackathonId, eventId });
    
    // Optimistic update for immediate UI feedback
    setHackathons(prevHackathons =>
      prevHackathons.map(h => {
        if (h.id === hackathonId) {
          const updatedEvents = h.events?.map(e => 
            e._id === eventId ? { ...e, completed: !e.completed } : e
          ) || [];
          return { ...h, events: updatedEvents };
        }
        return h;
      })
    );

    try {
      const hackathon = hackathons.find(h => h.id === hackathonId);
      const event = hackathon?.events?.find(e => e._id === eventId);
      
      if (event) {
        console.log('Updating event on server:', { hackathonId, eventId, newCompleted: !event.completed });
        const response = await hackathonService.updateEvent(hackathonId, eventId, { completed: !event.completed });
        
        // Update with server response to ensure consistency
        if (response && response.hackathon && response.hackathon._id) {
          console.log('Server response for event update:', response);
          setHackathons(prevHackathons =>
            prevHackathons.map(h =>
              h.id === response.hackathon._id
                ? { ...response.hackathon, id: response.hackathon._id }
                : h
            )
          );
        }
        
        console.log('Event completion toggled successfully! 🎉');
      }
    } catch (err) {
      console.error('Failed to update event', err);
      
      // Revert optimistic update on error
      setHackathons(prevHackathons =>
        prevHackathons.map(h => {
          if (h.id === hackathonId) {
            const revertedEvents = h.events?.map(e => 
              e._id === eventId ? { ...e, completed: !e.completed } : e
            ) || [];
            return { ...h, events: revertedEvents };
          }
          return h;
        })
      );
      
      alert('Failed to update event completion. Please try again.');
    }
  };

  const deleteEvent = async (hackathonId, eventId) => {
    try {
      await hackathonService.deleteEvent(hackathonId, eventId);
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  const startEditingHackathon = (hackathon) => {
    setEditingHackathon({
      ...hackathon,
      teamMembers: hackathon.teamMembers?.join(', ') || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingHackathon) return;
    try {
      const hackathonToUpdate = {
        ...editingHackathon,
        teamMembers: editingHackathon.teamMembers.split(',').map(member => member.trim()).filter(Boolean),
      };
      await hackathonService.updateHackathon(editingHackathon.id, hackathonToUpdate);
      setEditingHackathon(null);
    } catch (err) {
      console.error('Failed to save hackathon', err);
    }
  };

  const cancelHackathonEdit = () => {
    setEditingHackathon(null);
  };

  const updateHackathonStatus = async (hackathonId, status) => {
    try {
      await hackathonService.updateHackathon(hackathonId, { status });
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const deleteHackathon = async (id) => {
    try {
      await hackathonService.deleteHackathon(id);
    } catch (err) {
      console.error('Failed to delete hackathon', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'submitted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getMilestoneTypeIcon = (type) => {
    switch (type) {
      case 'milestone': return <Trophy size={16} />;
      case 'event': return <Calendar size={16} />;
      case 'deadline': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };



  const getDaysUntilEvent = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    return differenceInDays(eventDate, today);
  };

  const getUpcomingEvents = () => {
    const upcoming = [];
    hackathons.forEach(hackathon => {
      hackathon.events?.forEach(event => {
        if (!event.completed) {
          const daysUntil = getDaysUntilEvent(event.date);
          if (daysUntil >= 0 && daysUntil <= 7) {
            upcoming.push({
              ...event,
              hackathonName: hackathon.name,
              hackathonId: hackathon.id,
              daysUntil
            });
          }
        }
      });
    });
    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 -m-4 md:-m-6 p-6 space-y-6">
      {/* Header */}
            <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Hackathon Log</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          <span>Add Hackathon</span>
        </button>
      </div>

      {/* Upcoming Events Alert */}
      {upcomingEvents.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Bell className="text-orange-600 dark:text-orange-400" size={20} />
            <h3 className="font-semibold text-orange-800 dark:text-orange-300">Upcoming Events</h3>
          </div>
          <div className="space-y-2">
            {upcomingEvents.slice(0, 3).map(event => (
              <div key={event._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  {getMilestoneTypeIcon(event.type)}
                  <span className="text-orange-800 dark:text-orange-300">
                    {event.title} ({event.hackathonName})
                  </span>
                </div>
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  {event.daysUntil === 0 ? 'Today' : 
                   event.daysUntil === 1 ? 'Tomorrow' : 
                   `${event.daysUntil} days`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Hackathon Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Hackathon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hackathon Name
              </label>
              <input
                type="text"
                value={newHackathon.name}
                onChange={(e) => setNewHackathon({ ...newHackathon, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter hackathon name..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={newHackathon.startDate}
                onChange={(e) => setNewHackathon({ ...newHackathon, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={newHackathon.endDate}
                onChange={(e) => setNewHackathon({ ...newHackathon, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={newHackathon.teamName}
                onChange={(e) => setNewHackathon({ ...newHackathon, teamName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your team name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Members (comma-separated)
              </label>
              <input
                type="text"
                value={newHackathon.teamMembers}
                onChange={(e) => setNewHackathon({ ...newHackathon, teamMembers: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="John, Jane, Bob"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Idea
              </label>
              <textarea
                value={newHackathon.projectIdea}
                onChange={(e) => setNewHackathon({ ...newHackathon, projectIdea: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
                placeholder="Brief description of your project idea..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={addHackathon}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Add Hackathon
            </button>
          </div>
        </div>
      )}

      {/* Hackathons Grid */}
      {hackathons.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Trophy size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hackathons yet. Add your first hackathon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hackathons.map(hackathon => (
            <div
              key={hackathon.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {editingHackathon?.id === hackathon.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hackathon Name
                    </label>
                    <input
                      type="text"
                      value={editingHackathon.name}
                      onChange={(e) => setEditingHackathon({ ...editingHackathon, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={editingHackathon.startDate}
                        onChange={(e) => setEditingHackathon({ ...editingHackathon, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={editingHackathon.endDate}
                        onChange={(e) => setEditingHackathon({ ...editingHackathon, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={editingHackathon.teamName}
                      onChange={(e) => setEditingHackathon({ ...editingHackathon, teamName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Team Members (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingHackathon.teamMembers}
                      onChange={(e) => setEditingHackathon({ ...editingHackathon, teamMembers: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Idea
                    </label>
                    <textarea
                      value={editingHackathon.projectIdea}
                      onChange={(e) => setEditingHackathon({ ...editingHackathon, projectIdea: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="3"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelHackathonEdit}
                      className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    >
                      <Save size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {hackathon.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        <span>
                          {format(new Date(hackathon.startDate), 'MMM dd')} - {format(new Date(hackathon.endDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={hackathon.status}
                        onChange={(e) => updateHackathonStatus(hackathon.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(hackathon.status)}`}
                      >
                        <option value="registered">Registered</option>
                        <option value="in-progress">In Progress</option>
                        <option value="submitted">Submitted</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => startEditingHackathon(hackathon)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteHackathon(hackathon.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {hackathon.teamName && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Team: {hackathon.teamName}
                      </span>
                    </div>
                  )}

                  {hackathon.teamMembers && hackathon.teamMembers.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {hackathon.teamMembers.map((member, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {hackathon.projectIdea && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {hackathon.projectIdea}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                                                
                          setSelectedHackathon(hackathon);
                          setShowEventForm(true);
                        }}
                        className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
                      >
                        Add Event
                      </button>
                    </div>

                  </div>

                  {/* Events List - Always Visible */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Events & Milestones ({hackathon.events?.length || 0})</h4>
                      <button
                        onClick={() => {
                          console.log('Toggling events for hackathon:', hackathon);
                          console.log('Hackathon events:', hackathon.events);
                          setSelectedHackathon(selectedHackathon?.id === hackathon.id ? null : hackathon);
                        }}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                      >
                        {selectedHackathon?.id === hackathon.id ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                    {hackathon.events && hackathon.events.length > 0 ? (
                      <div className={`space-y-2 ${selectedHackathon?.id === hackathon.id ? '' : 'max-h-32 overflow-hidden'}`}>
                        {hackathon.events.map(event => (
                            <div
                              key={event._id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => toggleEventCompletion(hackathon.id, event._id)}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                                    event.completed
                                      ? 'bg-green-500 border-green-500 text-white shadow-lg scale-105'
                                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                                  }`}
                                  title={event.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                >
                                  {event.completed && <CheckCircle size={12} className="animate-pulse" />}
                                </button>
                                {getMilestoneTypeIcon(event.type)}
                                <div>
                                  <div className={`text-sm font-medium transition-all duration-200 ${
                                    event.completed 
                                      ? 'line-through text-gray-500 dark:text-gray-400 opacity-75' 
                                      : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {event.title}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {format(new Date(event.date), 'MMM dd, yyyy')}
                                    {event.time && ` at ${event.time}`}
                                  </div>
                                  {event.description && (
                                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                      {event.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => deleteEvent(hackathon.id, event._id)}
                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No events added yet.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      {showEventForm && selectedHackathon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Event for {selectedHackathon.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Event title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="milestone">Milestone</option>
                  <option value="event">Event</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time (optional)
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="2"
                  placeholder="Additional details..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEventForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HackathonLog;
