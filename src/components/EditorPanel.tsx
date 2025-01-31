// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import React, { CSSProperties, useContext, useRef, useState } from 'react';
import Editor, { loader, Monaco } from '@monaco-editor/react';
import openscadEditorOptions from '../language/openscad-editor-options.ts';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { buildUrlForStateParams } from '../state/fragment-state.ts';
import { getBlankProjectState, defaultSourcePath } from '../state/initial-state.ts';
import { ModelContext, FSContext } from './contexts.ts';
import FilePicker, {  } from './FilePicker.tsx';

// const isMonacoSupported = false;
const isMonacoSupported = (() => {
  const ua = window.navigator.userAgent;
  const iosWk = ua.match(/iPad|iPhone/i) && ua.match(/WebKit/i);
  return !iosWk;
})();

let monacoInstance: Monaco | null = null;
if (isMonacoSupported) {
  loader.init().then(mi => monacoInstance = mi);
}

export default function EditorPanel({className, style}: {className?: string, style?: CSSProperties}) {

  const model = useContext(ModelContext);
  if (!model) throw new Error('No model');

  const menu = useRef<Menu>(null);

  const state = model.state;

  const [editor, setEditor] = useState(null as monaco.editor.IStandaloneCodeEditor | null)

  if (editor) {
    const checkerRun = state.lastCheckerRun;
    const editorModel = editor.getModel();
    if (editorModel) {
      if (checkerRun && monacoInstance) {
        monacoInstance.editor.setModelMarkers(editorModel, 'openscad', checkerRun.markers);
      }
    }
  }

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.addAction({
      id: "openscad-render",
      label: "渲染 OpenSCAD",
      run: () => model.render({isPreview: false, now: true})
    });
    editor.addAction({
      id: "openscad-preview",
      label: "预览 OpenSCAD",
      run: () => model.render({isPreview: true, now: true})
    });
    editor.addAction({
      id: "openscad-save-do-nothing",
      label: "保存 (disabled)",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {}
    });
    editor.addAction({
      id: "openscad-save-project",
      label: "保存 OpenSCAD 项目",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS],
      run: () => model.saveProject()
    });
    setEditor(editor)
  }

  const items: MenuItem[] = [
    {
      icon: 'pi pi-refresh',
      label: "渲染 OpenSCAD",
      command: () => model.render({isPreview: false, now: true}),
    },
    {
      icon: 'pi pi-eye',
      label: "预览 OpenSCAD",
      command: () => model.render({isPreview: true, now: true}),
    },
    {
      icon: 'pi pi-save',
      label: "保存",
      disabled: !state.params.sources.some(s => s.content !== s.savedContent),
      command: () => model.save(),
    },
    {
      icon: 'pi pi-save',
      label: "保存 OpenSCAD 项目",
      command: () => model.export(),
    },
  ];

  const fileMenu: MenuItem[] = [
    {
      icon: 'pi pi-file',
      items: [
        {
          label: "新建项目",
          icon: 'pi pi-plus',
          command: () => model.newProject(),
        },
        {
          label: '分享项目',
          icon: 'pi pi-share-alt',
          command: () => model.share(),
        },
        { separator: true },
        {
          label: "新建文件",
          icon: 'pi pi-file',
          command: () => model.newFile(),
        },
        {
          label: "复制到新文件",
          icon: 'pi pi-copy',
          command: () => model.copyToNewFile(),
        },
        {
          label: "上传文件",
          icon: 'pi pi-upload',
          command: () => model.uploadFile(),
        },
        {
          label: '下载源文件',
          icon: 'pi pi-download',
          command: () => model.downloadSources(),
        },
      ]
    },
    {
      icon: 'pi pi-pencil',
      items: [
        {
          label: '全选',
          icon: 'pi pi-check-square',
          command: () => editor?.getAction('editor.action.selectAll')?.run(),
        },
        {
          label: '查找',
          icon: 'pi pi-search',
          command: () => editor?.getAction('actions.find')?.run(),
        }
      ]
    },
  ];

  return (
    <div className={`editor-panel ${className ?? ''}`} style={{
      // maxWidth: '5 0vw',
      display: 'flex',
      flexDirection: 'column',
      // position: 'relative',
      // width: '100%', height: '100%',
      ...(style ?? {})
    }}>
      <div className='flex flex-row gap-2' style={{
        margin: '5px',
      }}>
          
        <Menu model={fileMenu} popup ref={menu} />
        <Button title="编辑器菜单" rounded text icon="pi pi-ellipsis-h" onClick={(e) => menu.current && menu.current.toggle(e)} />
        
        <FilePicker 
            style={{
              flex: 1,
            }}/>

        {state.params.activePath !== defaultSourcePath && 
          <Button icon="pi pi-chevron-left" 
          text
          onClick={() => model.openFile(defaultSourcePath)} 
          title={`返回 ${defaultSourcePath}`}/>}

      </div>

      
      <div style={{
        position: 'relative',
        flex: 1
      }}>
        {isMonacoSupported && (
          <Editor
            className="openscad-editor absolute-fill"
            defaultLanguage="openscad"
            path={state.params.activePath}
            value={model.source}
            onChange={s => model.source = s ?? ''}
            onMount={onMount} // TODO: This looks a bit silly, does it trigger a re-render??
            options={{
              ...openscadEditorOptions,
              fontSize: 16,
              lineNumbers: state.view.lineNumbers ? 'on' : 'off',
            }}
          />
        )}
        {!isMonacoSupported && (
          <InputTextarea 
            className="openscad-editor absolute-fill"
            value={model.source}
            onChange={s => model.source = s.target.value ?? ''}  
          />
        )}
      </div>

      <div style={{
        display: state.view.logs ? undefined : 'none',
        overflowY: 'scroll',
        height: 'calc(min(200px, 30vh))',
      }}>
        {(state.currentRunLogs ?? []).map(([type, text], i) => (
          <pre key={i}>{text}</pre>
        ))}
      </div>
    
    </div>
  )
}
