import VariableTypes from "./VariableTypes";
import VariablesAndConstants from "./VariablesAndConstants";
import BooleanVariables from "./BooleanVariables";
import TernaryOperator from "./TernaryOperator";
import Ifelse from "./IfElse";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import TodoList from "./todos/TodoList";
import Spreading from "./Spreading";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import Math from "./Math";
import DestructingImports from "./DestructingImports";
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";
import PathParameters from "./PathParameters";
import Classes from "./Classes";
import Styles from "./Styles";
import { useSelector } from "react-redux";
export default function Lab3() {
  const { todos } = useSelector((state: any) => state.todosReducer);
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h3>Lab 3</h3>
      <ul className="list-group">
        {todos.map((todo: any) => (
          <li className="list-group-item" key={todo.id}>
            {todo.title}
          </li>
        ))}
      </ul>
      <hr />

      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <Ifelse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <JsonStringify />
      <House />
      <TodoList />
      <Spreading />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />
      <Classes />
      <Styles />
      <Add a={3} b={4} />
      <h4>
        <Highlight>Square of 4</Highlight>
      </h4>
      <br />
      <h3>JavaScript</h3>
      <Square>4</Square>
      <br />
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipitratione
        eaque illo minus cum, saepe totam vel nihil repellat nemo explicabo
        excepturi consectetur. Modi omnis minus sequi maiores, provident
        voluptates.
      </Highlight>

      <hr />
      <PathParameters />
    </div>
  );
}
