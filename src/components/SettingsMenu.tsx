// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import { CSSProperties, useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { ModelContext } from './contexts.ts';
import { isInStandaloneMode } from '../utils.ts';
import { confirmDialog } from 'primereact/confirmdialog';

export default function SettingsMenu({className, style}: {className?: string, style?: CSSProperties}) {
  const model = useContext(ModelContext);
  if (!model) throw new Error('No model');
  const state = model.state;

  const settingsMenu = useRef<Menu>(null);
  return (
    <>
      <Menu model={[
        {
          label: state.view.layout.mode === 'multi'
            ? '切换到单面板模式'
            : "切换到多面板模式",
          icon: 'pi pi-table',
          // disabled: true,
          command: () => model.changeLayout(state.view.layout.mode === 'multi' ? 'single' : 'multi'),
        },
        {
          separator: true
        },  
        {
          label: state.view.showAxes ? '隐藏坐标轴' : '显示坐标轴',
          icon: 'pi pi-asterisk',
          // disabled: true,
          command: () => model.mutate(s => s.view.showAxes = !s.view.showAxes),
        },
        {
          label: state.view.lineNumbers ? '隐藏行号' : '显示行号',
          icon: 'pi pi-list',
          command: () => model.mutate(s => s.view.lineNumbers = !s.view.lineNumbers),
        },
        ...(isInStandaloneMode() ? [
          {
            separator: true
          },  
          {
            label: '清除本地存储',
            icon: 'pi pi-trash',
            // disabled: true,
            command: () => {
              confirmDialog({
                message: "这将清除您在此播放器中所做的所有编辑和创建的文件，并将其重置为出厂默认值。 " +
                  "您确定要继续吗？（您可能会丢失模型！）",
                header: '清除本地存储',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  localStorage.clear();
                  location.reload();
                },
                acceptLabel: `清除所有文件！`,
                rejectLabel: '取消'
              });
            },
          },
        ] : []),
      ] as MenuItem[]} popup ref={settingsMenu} />
    
      <Button title="设置菜单"
          style={style}
          className={className}
          rounded
          text
          icon="pi pi-cog"
          onClick={(e) => settingsMenu.current && settingsMenu.current.toggle(e)} />
    </>
  );
}