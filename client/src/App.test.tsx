import renderer from "react-test-renderer";
import App from "./App";

test("renders app", () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
