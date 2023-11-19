import React, {useState} from "react";

import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from '../../../utils/array-move/index';
import {updateTodoQueue} from "../../../actions/exp_actions";

const SortableItem = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({todo_queue}) => {
    return (
        <ol>
            {todo_queue.map((value, index) => (
                <SortableItem key={`item-${value}`} index={index} value={value} />
            ))}
        </ol>
    );
});

export class SetQueueTurns extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            todo_queue: this.props.todo_queue,
            loading: false,
            hide_arr: true
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.todo_queue !== this.props.todo_queue){
            this.setState({
                todo_queue: this.props.todo_queue,
            });
        }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        let sc = this.state;
        sc.loading = true;
        sc.todo_queue = arrayMove(sc.todo_queue, oldIndex, newIndex);

        this.setState(sc, () => {
            updateTodoQueue({todo_queue: sc.todo_queue}).then(
                res => {
                    sc.loading = false;
                    this.setState(sc);
                }
            )
        })
        // this.setState(({todo_queue}) => ({
        //     todo_queue: ,
        // }));
    };

    toggleQueueOrder = () => {
        this.setState(({hide_arr}) => ({
            hide_arr: !hide_arr
        }));
    }

    render() {
        if (this.state.loading)
            return <div>Loading</div>;

        return (
            <div className='admin-todo-su-qt unselectable'>
                <label onClick={this.toggleQueueOrder}><span>{this.state.hide_arr? '+' : '-'}</span> Priority order:</label>
                {
                    !this.state.hide_arr && (
                        <SortableList
                            todo_queue={this.state.todo_queue}
                            onSortEnd={this.onSortEnd}
                            helperClass="dragging-helper-class"
                        />
                    )
                }
            </div>
        )
    }
}
