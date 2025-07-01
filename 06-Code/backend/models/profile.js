class Profile {
  constructor({ profiles_name, selected_permits = [] }) {
    this.profiles_name = profiles_name;
    this.selected_permits = Array.isArray(selected_permits) ? selected_permits : [selected_permits];
  }

  static validateName(name) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('El nombre del perfil es requerido.');
    }
    if (name.length > 50) {
      throw new Error('El nombre del perfil es demasiado largo.');
    }
    return name.trim();
  }

  static validatePermits(permits, allPermits) {
    const validated = {};
    for (const key of allPermits) {
      validated[key] = permits?.[key] ? 1 : 0;
    }
    return validated;
  }
}

module.exports = Perfil;
