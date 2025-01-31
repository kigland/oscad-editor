// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import React, { CSSProperties, useContext, useRef } from 'react';
import { ModelContext } from './contexts.ts';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import HelpMenu from './HelpMenu.tsx';
import ExportButton from './ExportButton.tsx';
import SettingsMenu from './SettingsMenu.tsx';


export default function Footer({ style }: { style?: CSSProperties }) {
  const model = useContext(ModelContext);
  if (!model) throw new Error('No model');
  const state = model.state;

  const toast = useRef<Toast>(null);

  const severityByMarkerSeverity = new Map<monaco.MarkerSeverity, 'danger' | 'warning' | 'info'>([
    [monaco.MarkerSeverity.Error, 'danger'],
    [monaco.MarkerSeverity.Warning, 'warning'],
    [monaco.MarkerSeverity.Info, 'info'],
  ]);
  const markers = state.lastCheckerRun?.markers ?? [];
  const getBadge = (s: monaco.MarkerSeverity) => {
    const count = markers.filter(m => m.severity == s).length;
    const sev = s == monaco.MarkerSeverity.Error ? 'danger'
      : s == monaco.MarkerSeverity.Warning ? 'warning'
        : s == monaco.MarkerSeverity.Info ? 'info'
          : 'success';
    return <>{count > 0 && <Badge value={count} severity={severityByMarkerSeverity.get(s)}></Badge>}</>;
  };


  const maxMarkerSeverity = markers.length == 0 ? undefined : markers.map(m => m.severity).reduce((a, b) => Math.max(a, b));

  return <>
    <ProgressBar mode="indeterminate"
      style={{
        marginLeft: '5px',
        marginRight: '5px',
        visibility: state.rendering || state.previewing || state.checkingSyntax || state.exporting
          ? 'visible' : 'hidden',
        height: '6px'
      }}></ProgressBar>

    <div className="flex flex-row gap-1" style={{
      alignItems: 'center',
      margin: '5px',
      position: 'relative',
      ...(style ?? {})
    }}>
      <div className="flex flex-row gap-1" style={{ position: 'absolute', left: 0 }}>
        {(state.lastCheckerRun || state.output) &&
          <Button type="button"
            severity={maxMarkerSeverity && severityByMarkerSeverity.get(maxMarkerSeverity)}
            icon="pi pi-align-left"
            text={!state.view.logs}
            onClick={() => model.logsVisible = !state.view.logs}
            className={maxMarkerSeverity && `p-button-${severityByMarkerSeverity.get(maxMarkerSeverity) ?? 'success'}`}
          >
            {getBadge(monaco.MarkerSeverity.Error)}
            {getBadge(monaco.MarkerSeverity.Warning)}
            {getBadge(monaco.MarkerSeverity.Info)}
          </Button>}
      </div>

      <div style={{ margin: '0 auto' }}>
        {state.output && !state.output.isPreview
          ? (
            <ExportButton />
          ) : state.previewing ? (
            <Button
              icon="pi pi-box"
              disabled
              className="p-button-sm"
              label="预览中..."
            />
          ) : state.output && state.output.isPreview ? (
            <Button
              icon="pi pi-box"
              loading={state.rendering}
              disabled={state.rendering}
              severity="secondary"
              label={state.rendering ? '生成中...' : '生成模型'}
              onClick={() => model.render({ isPreview: false, now: true })}
              className="p-button-sm footer-model-btn"
            />
          ) : undefined
        }
      </div>

      <div style={{ position: 'absolute', right: 0 }}>
        <SettingsMenu />
        <HelpMenu style={{
          position: 'absolute',
          right: 0,
          top: '4px',
        }} />
      </div>
      <Toast ref={toast} />
    </div>
  </>
}
