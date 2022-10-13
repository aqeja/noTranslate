import React from "react";

class ErrorBoundary extends React.Component<{ hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch() {
    //
  }
  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="h-screen flex justify-center items-center pb-40">
          <div className="text-center">
            <p className="font-mono text-2xl">ops！出现了一个未知错误</p>
            <div
              className="mt-6"
              onClick={() => {
                window.location.href = `/home`;
              }}
            >
              <button>回到首页</button>
              <button
                className="ml-4"
                onClick={() => {
                  window.location.reload();
                }}
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
