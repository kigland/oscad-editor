import React, { useContext } from 'react';
import { ModelContext } from './contexts.ts';

import { SplitButton } from 'primereact/splitbutton';
import { MenuItem } from 'primereact/menuitem';

type ExtendedMenuItem = MenuItem & { buttonLabel?: string };

export default function ExportButton({ className, style }: { className?: string, style?: React.CSSProperties }) {
  const model = useContext(ModelContext);
  if (!model) throw new Error('No model');
  const state = model.state;

  const dropdownModel: ExtendedMenuItem[] =
    state.is2D ? [
      {
        data: 'svg',
        buttonLabel: 'SVG (矢量图形)',
        label: 'SVG (矢量图形)',
        icon: 'pi pi-image',
        command: () => model!.setFormats('svg', undefined),
      },
      {
        data: 'dxf',
        buttonLabel: 'DXF (绘图交换格式)',
        label: 'DXF (绘图交换格式)',
        icon: 'pi pi-image',
        command: () => model!.setFormats('dxf', undefined),
      },
    ] : [
      {
        data: 'glb',
        buttonLabel: '下载 GLB (二进制 glTF)',
        label: '下载 GLB (二进制 glTF)',
        icon: 'pi pi-box',
        command: () => model!.setFormats(undefined, 'glb'),
      },
      {
        data: 'stl',
        buttonLabel: '下载 STL (二进制)',
        label: '下载 STL (二进制)',
        icon: 'pi pi-box',
        command: () => model!.setFormats(undefined, 'stl'),
      },
      {
        data: 'off',
        buttonLabel: '下载 OFF (对象文件格式)',
        label: '下载 OFF (对象文件格式)',
        icon: 'pi pi-box',
        command: () => model!.setFormats(undefined, 'off'),
      },
      {
        data: '3mf',
        buttonLabel: '下载 3MF (多材质)',
        label: '下载 3MF (多材质)',
        icon: 'pi pi-box',
        command: () => model!.setFormats(undefined, '3mf'),
      },
      {
        separator: true
      },
      // {
      //   label: '编辑材质' + ((state.params.extruderColors ?? []).length > 0 ? ` (${(state.params.extruderColors ?? []).length})` : ''),
      //   icon: 'pi pi-palette',
      //   command: () => model!.mutate(s => {
      //     // 直接展开参数编辑面板的多材质部分
      //     s.view.collapsedCustomizerTabs = s.view.collapsedCustomizerTabs?.filter(t => t !== '多材质') ?? [];
      //   }),
      // }
    ];

  const exportFormat = state.is2D ? state.params.exportFormat2D : state.params.exportFormat3D;
  const selectedItem = dropdownModel.filter(item => item.data === exportFormat)[0] || dropdownModel[0]!;

  return (
    <div className={className} style={style}>
      <SplitButton
        label={selectedItem.buttonLabel}
        disabled={!state.output || state.output.isPreview || state.rendering || state.exporting}
        icon="pi pi-download"
        model={dropdownModel}
        severity="secondary"
        onClick={e => model!.export()}
        className="p-button-sm"
      />
    </div>
  );
}
