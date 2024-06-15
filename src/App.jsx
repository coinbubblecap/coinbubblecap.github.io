import { ApolloProvider } from "@apollo/client";
import "./App.css";
import TokenList from "./TokenList";
import client from "./apolloClient";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <TokenList />
      </div>
    </ApolloProvider>
  );
}

export default App;
