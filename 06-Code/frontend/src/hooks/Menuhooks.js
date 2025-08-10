import { useMemo } from 'react';

const useMenuVisibility = (permits) => {
  const visibility = useMemo(() => {
    if (!permits) {
      return {
        showProjects: false,
        showUsers: false,
        showProfiles: false,
      };
    }

    const hasAnyTrue = (groupNames) => {
      for (const groupName of groupNames) {
        const group = permits[groupName];
        if (group) {
          const permsInGroup = Object.values(group);
          if (permsInGroup.some((perm) => perm.value === true)) {
            return true;
          }
        }
      }
      return false;
    };

    return {
      showProjects: hasAnyTrue(['Proyectos', 'Planes Ambientales', 'Actividad', 'Periodo de Supervision', 'Monitoreos', 'Acciones']),
      showUsers: hasAnyTrue(['Usuarios']),
      showProfiles: hasAnyTrue(['Perfiles']),
    };
  }, [permits]);

  return visibility;
};

export { useMenuVisibility };