import { lazy, Suspense } from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));

function AppSuspenseFallback() {
  return (
    <div className="app-suspense-fallback" aria-hidden="true">
      <div className="app-suspense-spinner" />
    </div>
  );
}

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<AppSuspenseFallback />}>
          <MainContainer>
            <Suspense fallback={<AppSuspenseFallback />}>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
