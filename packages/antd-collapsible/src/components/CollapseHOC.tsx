import { type FC, useCallback, useMemo, useState } from 'react';
import type { FormContextType } from '@rjsf/utils';
import { Collapse, type GetProps } from 'antd';

interface CollapseHOCProps extends Omit<GetProps<typeof Collapse>, 'onChange' | 'activeKey'> {
  id: string;
  formContext?: FormContextType;
  expandTime?: number;
  forceExpand?: boolean;
}

interface CollapseHOCContext {
  collapsedList?: string[];
  onCollapsedChange?(id: string, collapsed: boolean): void;
}

const CollapseHOC: FC<CollapseHOCProps> = ({ id, formContext = {}, expandTime, forceExpand, ...props }) => {
  const { collapsedList, onCollapsedChange } = formContext as CollapseHOCContext;
  const defaultActiveKey = useMemo(() => [id], [id]);
  const [activeKey, setActiveKey] = useState(collapsedList?.includes(id) ? [] : defaultActiveKey);
  const onChange = useCallback(
    (actived: string[] | string) => {
      if (forceExpand) {
        return;
      }
      const collapsed = actived.length === 0;
      setActiveKey(collapsed ? [] : defaultActiveKey);
      onCollapsedChange?.(id, collapsed);
    },
    [id, defaultActiveKey, onCollapsedChange, forceExpand]
  );
  return <Collapse onChange={onChange} activeKey={forceExpand ? defaultActiveKey : activeKey} {...props} />;
};

export default CollapseHOC;
