import FilterLink from './filter-link';
import React from 'react';

const FilterList = ({
    visibilityFilter,
    onFilterClick,
    onDeleteCompleted,
    activeStatus
}) => {
    return (
        <div>
            <p>
                Show: {'    '}

                <FilterLink
                filter="SHOW_ALL"
                currentFilter={visibilityFilter}
                onClick={onFilterClick}>
                    All
                </FilterLink>

                {',  '}

                <FilterLink
                filter="SHOW_ACTIVE"
                currentFilter={visibilityFilter}
                onClick={onFilterClick}>
                    Active
                </FilterLink>

                {',  '}

                <FilterLink
                filter="SHOW_COMPLETED"
                currentFilter={visibilityFilter}
                onClick={onFilterClick}>
                    Completed
                </FilterLink>

            </p>

            {activeStatus === true ? <button onClick={onDeleteCompleted}>Delete Completed Todos</button> : ''}

        </div>
    );
}

export default FilterList;