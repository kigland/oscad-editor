// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import { CSSProperties, useRef } from 'react';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';

export default function HelpMenu({ className, style }: { className?: string, style?: CSSProperties }) {
  const menuRef = useRef<Menu>(null);
  return (
    <>
      <Menu style={style} className={className} model={[
        {
          label: "偶域 Github",
          icon: 'pi pi-github',
          url: 'https://github.com/kigland',
          target: '_blank'
        },
        {
          label: "openscad-playground",
          icon: 'pi pi-github',
          url: 'https://github.com/openscad/openscad-playground/',
          target: '_blank'
        },
        {
          label: '许可证',
          icon: 'pi pi-info-circle',
          url: 'https://github.com/openscad/openscad-playground/blob/main/LICENSE.md',
          target: '_blank'
        },
        {
          label: 'SCAD 教程',
          icon: 'pi pi-book',
          url: 'https://openscad.org/documentation.html',
          target: '_blank'
        },
        {
          label: '定制参数',
          icon: 'pi pi-book',
          url: 'https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Customizer',
          target: '_blank'
        },

        {
          label: 'OpenSCAD 小册',
          icon: 'pi pi-palette',
          url: 'https://openscad.org/cheatsheet/',
          target: '_blank'
        },
        {
          label: 'BOSL2 小册',
          icon: 'pi pi-palette',
          url: 'https://github.com/BelfrySCAD/BOSL2/wiki/CheatSheet',
          target: '_blank'
        },
      ] as MenuItem[]} popup ref={menuRef} />

      <Button title="Help & Licenses"
        rounded
        text
        icon="pi pi-question-circle"
        onClick={(e) => menuRef.current && menuRef.current.toggle(e)} />
    </>
  );
}