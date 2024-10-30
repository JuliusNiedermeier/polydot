import {
  createSignal,
  type Component,
  type ComponentProps,
  For,
  onMount,
  onCleanup,
} from "solid-js";

type Position = { x: number; y: number };
type Size = { width: number; height: number };

const App: Component = () => {
  const [windowSize, setWindowSize] = createSignal<Size>({
    height: 0,
    width: 0,
  });

  const [nodes, setNodes] = createSignal<Position[]>([]);

  const [stepsBack, setStepsBack] = createSignal(0);

  const visibleNodes = () => nodes().slice(0, nodes().length - stepsBack());

  const edges = () =>
    visibleNodes()
      .map((node) =>
        visibleNodes()
          .filter((_node) => _node !== node)
          .map((_node) => [node, _node])
      )
      .flat();

  const handleContainerClick: ComponentProps<"div">["onClick"] = (e) => {
    setNodes((current) => current.slice(0, visibleNodes().length));
    setStepsBack(0);
    setNodes((current) => [...current, { x: e.clientX, y: e.clientY }]);
  };

  const updateWindowSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  onMount(() => {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    onCleanup(() => window.removeEventListener("resize", updateWindowSize));
  });

  return (
    <>
      <div class="absolute top-4 left-4 flex gap-2">
        <button
          class="w-8 h-8 rounded bg-gray-100 grid place-content-center"
          onClick={() =>
            setStepsBack((current) =>
              visibleNodes().length > 0 ? current + 1 : current
            )
          }
        >
          {"↩"}
        </button>
        <button
          class="w-8 h-8 rounded bg-gray-100 grid place-content-center"
          onClick={() =>
            setStepsBack((current) => (current > 0 ? current - 1 : current))
          }
        >
          {"↪"}
        </button>
      </div>
      <div
        class="h-screen w-screen overflow-hidden"
        onClick={handleContainerClick}
      >
        {/* <pre class="absolute">{JSON.stringify(edges(), null, 2)}</pre> */}
        <For each={visibleNodes()}>
          {(node) => (
            <div
              class="absolute h-2 w-2 rounded-full bg-black hover:ring"
              style={{
                top: `${node.y}px`,
                left: `${node.x}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </For>
        <svg height={windowSize().height} width={windowSize().width}>
          {/* <For each={nodes()}>
      {(node) => <circle cx={node.x} cy={node.y} r="5" fill="black" />}
    </For> */}
          <For each={edges()}>
            {(edge) => (
              <line
                x1={edge[0].x}
                y1={edge[0].y}
                x2={edge[1].x}
                y2={edge[1].y}
                stroke="black"
              />
            )}
          </For>
        </svg>
      </div>
    </>
  );
};

export default App;
