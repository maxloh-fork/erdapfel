import styleIcons from '@qwant/qwant-basic-gl-style/icons.yml';

const nameToClass = iconName => iconName.match(/^(.*?)-[0-9]{1,2}$/)[1];

export default class IconManager {
  static get({ className, subClassName, type }) {

    // Get the category icon of a PoI
    if (type === 'poi' || type === 'category') {
      const icons = styleIcons.mappings;

      // Matching class and subclass
      let icon = icons.find(iconProperty => {
        return iconProperty.subclass === subClassName && iconProperty.class === className;
      });

      // Or: no class and matching subclass
      if (!icon) {
        icon = icons.find(iconProperty => {
          return iconProperty.subclass === subClassName && !iconProperty.class;
        });
      }

      // Or: matching class and no subclass
      if (!icon) {
        icon = icons.find(iconProperty => {
          return iconProperty.class === className && !iconProperty.subclass;
        });
      }

      if (icon) {
        const iconName = icon.iconName;
        const color = icon.color;
        const iconClass = nameToClass(iconName);
        return { iconClass, color };
      }

      return {
        iconClass: nameToClass(styleIcons.defaultIcon),
        color: styleIcons.defaultColor,
      };

    // Get the icon of a location / area that is not a PoI:
    // Exact address
    } else if (type === 'house' || type === 'address') {
      return {
        iconClass: nameToClass(styleIcons.defaultAddressIcon),
        color: styleIcons.defaultAddressColor,
      };

    // Road / street without house number
    } else if (type === 'street') {
      return {
        iconClass: nameToClass(styleIcons.defaultStreetIcon),
        color: styleIcons.defaultStreetColor,
      };

    // administrative zones (city, area, country)
    } else {
      return {
        iconClass: nameToClass(styleIcons.defaultAdministrativeIcon),
        color: styleIcons.defaultAdministrativeColor,
      };
    }
  }
}

export function createIcon(iconOptions, name, hoverEffect = false) {
  const icon = IconManager.get(iconOptions);

  // Show a white circle instead of marker2 in map markers of PoI that have no class or subclass.
  if (icon.iconClass === nameToClass(styleIcons.defaultIcon)) {
    icon.iconClass = 'circle';
  }

  const element = document.createElement('div');
  element.innerHTML = `
    <div class="marker">
      <div class="marker-container${hoverEffect ? ' poi-hoverable' : ''}">
        <i class="icon icon-${icon.iconClass}"></i>
      </div>
    </div>
  `;
  return element.firstElementChild;
}

export function createEventIcon(iconOptions, name, hoverEffect = false) {
  const element = document.createElement('div');
  element.innerHTML = `
    <div class="marker">
      <div class="marker-container${hoverEffect ? ' poi-hoverable' : ''}">
        <i class="icon icon-${iconOptions.eventIcon}"></i>
      </div>
    </div>
  `;
  return element.firstElementChild;
}

window.IconManager = IconManager;
