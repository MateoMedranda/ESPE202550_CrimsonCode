class Project {
    constructor(id, name, description, location, startDate, endDate, status, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    addParticipant(person) {
        this.participants.push(person);
        this.updatedAt = new Date();
    }

    removeParticipant(personId) {
        this.participants = this.participants.filter(p => p.id !== personId);
        this.updatedAt = new Date();
    }

    getParticipants() {
        return this.participants;
    }

    summary() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            location: this.location,
            status: this.status,
            startDate: this.startDate,
            endDate: this.endDate,
            activityCount: this.activities.length,
            participantCount: this.participants.length
        };
    }
}

module.exports = Project;
