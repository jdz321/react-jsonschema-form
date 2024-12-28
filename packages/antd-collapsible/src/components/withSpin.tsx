import { ComponentType, CSSProperties, LazyExoticComponent, Suspense } from 'react';
import { Spin, type GetProps } from 'antd';
import { FC } from 'react';

export default function withSpin<T extends ComponentType<any> | LazyExoticComponent<ComponentType<any>>>(
  Comp: T,
  tip: string
) {
  return ((props: GetProps<T>) => {
    const holderProps = 'style' in props ? { style: props.style as CSSProperties } : {};
    return (
      <Suspense
        fallback={
          <Spin tip={tip}>
            <div {...holderProps} />
          </Spin>
        }
      >
        <Comp {...props} />
      </Suspense>
    );
  }) as FC<GetProps<T>>;
}
