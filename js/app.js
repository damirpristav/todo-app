/////////////////////////////////////////
// Model
var todoModel = (function(){
    
    var Title = function(id, value, title){
        this.id = id;
        this.value = value;
        this.title = title;
    };
    
    var Goal = function(listID, value, title){
        this.listID = listID;
        this.value = value;
        this.title = title;
    };
    
    var countIDS = function(arr, id){
        
        if( data.lists.indexOf(id) > -1 ){
            data.listCounts[data.lists.indexOf(id)] = data.listCounts[data.lists.indexOf(id)] + 1;
        }
        
        arr.forEach(function(obj, i){
            if( data.lists.indexOf(id) === -1 ){
                data.lists.push(id);
                data.listCounts.push(1);
            }
        });  
        
    };
    
    var currentYearGoal = function(){
        var date = new Date();
        var year = date.getFullYear();
        return  year + ' Goals';
    };
    
    var defaultTitle = function(){
        return new Title('default-list', 'default', currentYearGoal());  
    };
    
    var data = {
        titles: [defaultTitle()],
        goals: [],
        lists: [],
        listCounts: []
    };
    
    return {
        addTitle: function(title){
            var newTitle, optionValue, titlesArrLength, found, titleValue;
            
            // Split title to array of strings
            optionValue = title.split(" ");
            // Join new array of strings with underscore between
            optionValue = optionValue.join("_");
            // Convert new string to lowercase
            optionValue = optionValue.toLowerCase();
            
            // Create new title object
            newTitle = new Title(optionValue + '-list' , optionValue, title);
            // Get length of the titles array
            titlesArrLength = data.titles.length;
            // Set found to false when button clicked
            found = false;
            
            // Loop through each item and check if title already exists
            for( var i=0; i<titlesArrLength; i++ ){
                titleValue = data.titles[i].title;
                if( titleValue === title ){
                    found = true;
                }
            }
            
            // If title exists return false
            if(found){
                console.log('Title already exists!');
                return false;
            }else{ // If title does not exists add it to titles array
                data.titles.push(newTitle);
                console.log('New title added!');
                return newTitle;
            }
            
        },
        
        addGoal: function(obj){
            var newGoal;
            
            newGoal = new Goal(obj.listID, obj.value, obj.title);
            data.goals.push(newGoal);
            countIDS(data.goals, obj.listID);
            
            return newGoal;
        },
        
        getData: function(){
            return data;
        },
        
        getTitles: function(){
            return data.titles;  
        },
        
        updateNumOfAllGoals: function(ulID){
            data.listCounts[data.lists.indexOf(ulID)] = data.listCounts[data.lists.indexOf(ulID)] - 1;
        },
        
        testing: function(){
            console.log(data);
        }  
    };
    
})();

/////////////////////////////////////////
// View
var todoView = (function(){
    
    var elements = {
        titleInput: '#title-input',
        titleSubmit: '#title-submit',
        titleDropdown: '#todo-title',
        goalInput: '#todo-input',
        goalSubmit: '#goal-submit',
        goalID: '#todo-id',
        goalsContainer: '#goals'
    };
    
    var checkForItems = function(id){
        var ul, wrapper;
        
        // get ul
        ul = document.getElementById(id);
        
        if(ul.childNodes.length == 0){ // Check if there is no children elements
            
            // Delete whole container(.todo-list-wrap)
            wrapper = ul.parentNode;
            wrapper.parentNode.removeChild(wrapper);
            
        }
        
    };
    
    var countCompletedGoals = function(ulID){
        return document.querySelectorAll('#' + ulID + ' .completed').length;
    };
    
    var updateCompletedGoals = function(listID, data, completed){
        if(document.getElementById(listID)){
            for( var i=0; i<document.getElementById(listID).nextSibling.childNodes.length; i++ ){
                if( document.getElementById(listID).nextSibling.childNodes[i].className === 'left' ){
                    document.getElementById(listID).nextSibling.childNodes[i].innerHTML = data.listCounts[data.lists.indexOf(listID)] - completed;
                }
            }
        }
    };
    
    var updateNumOfGoals = function(listID, data){
        if(document.getElementById(listID)){
            for( var i=0; i<document.getElementById(listID).nextSibling.childNodes.length; i++ ){
                if( document.getElementById(listID).nextSibling.childNodes[i].className === 'all' ){
                    document.getElementById(listID).nextSibling.childNodes[i].innerHTML = data.listCounts[data.lists.indexOf(listID)];
                }
            }
        }
    };
    
    return {
        addTitle: function(obj){
            var element, option;
            
            // 1. Create option for dropdown
            option = document.createElement("option");
            
            // 2. Set option value & title
            option.value = obj.value;
            option.text = obj.title;
            
            // 3. Insert option into the select element
            element = document.querySelector(elements.titleDropdown);
            if(obj.title !== ''){
                element.add(option);
            }
            
        },
        
        addGoal: function(obj, titles, data){
            var wrapEl, newWrapEl, listEl, newListEl, element, titles, completed;
            
            completed = countCompletedGoals(obj.listID);
            
            // 1. Create html wrap element with title placeholder and list wrap
            wrapEl = '<div class="todo-list-wrap"><h2>%title%</h2><ul id="%id%" class="list"></ul><div class="remaining"><span class="left">%left%</span> of <span class="all">%all%</span> goals remaining</div></div>';
            
            // 2. Create html list item with placeholder
            listEl = '<li class="item"><a href="#" class="check" title="Mark this goal as completed"><i class="fa fa-check"></i></a><span>%goal%</span><a href="#" class="remove" title="Remove this goal"><i class="fa fa-close"></i></a></li>';
            
            // 3. Replace placeholder with data
            newWrapEl = wrapEl.replace('%title%', obj.title);
            newWrapEl = newWrapEl.replace('%id%', obj.listID);
            newWrapEl = newWrapEl.replace('%left%', (data.listCounts[data.lists.indexOf(obj.listID)]) - completed );
            newWrapEl = newWrapEl.replace('%all%', data.listCounts[data.lists.indexOf(obj.listID)]);
            newListEl = listEl.replace('%goal%', obj.value);
            
            // 4. Insert the new list element into the DOM
            if( !document.getElementById(obj.listID) ){
                document.querySelector(elements.goalsContainer).insertAdjacentHTML('afterbegin', newWrapEl);
            }
            
            document.getElementById(obj.listID).insertAdjacentHTML('beforeend', newListEl);
            
            // 5. Update number of goals in a list
            updateNumOfGoals(obj.listID, data);
            
            // 6. Update completed goals in a list
            updateCompletedGoals(obj.listID, data, completed);
            
        },
        
        clearTitleField: function(){
            document.querySelector(elements.titleInput).value = "";
            document.querySelector(elements.titleInput).focus();
        },
        
        clearGoalsFields: function(){
            document.querySelector(elements.goalInput).value = "";
            document.querySelector(elements.goalInput).focus();
            document.querySelector(elements.titleDropdown).value = 'default';
            document.querySelector(elements.goalID).value = document.querySelector(elements.titleDropdown).value + '-list';
        },
        
        getElements: function(){
            return elements;
        },
        
        getTitle: function(){
            return {
                value: document.querySelector(elements.titleInput).value
            }
        },
        
        getGoal: function(){
            return {
                listID: document.querySelector(elements.goalID).value,
                value: document.querySelector(elements.goalInput).value,
                title: document.querySelector(elements.titleDropdown).options[document.querySelector(elements.titleDropdown).selectedIndex].text,
            }
        },
        
        getCompletedGoals: function(){
            return countCompletedGoals();
        },
        
        getCurrentYearGoal: function(){
            var date = new Date();
            document.querySelector(elements.titleDropdown).innerHTML = '<option value="default">' + date.getFullYear() + ' Goals</option>';
        },
        
        completeGoal: function(el, data){
            var element, elToComplete, ulID;
            
            element = el;
            
            if( element.className === 'fa fa-check' ){ // if check icon is clicked
                
                // get li element
                elToComplete = element.parentNode.parentNode;
                // toggle class completed
                elToComplete.classList.toggle('completed');
                // update number of completed goals
                ulID = element.parentNode.parentNode.parentNode.id;
                // count completed goal
                var completed = countCompletedGoals(ulID);
                // update completed goal
                updateCompletedGoals(ulID, data, completed);
                
            }else if( element.className === 'check' ){ // if a tag is clicked
                
                // get li element
                elToComplete = element.parentNode;
                // toggle class completed
                elToComplete.classList.toggle('completed');
                // update number of completed goals
                ulID = element.parentNode.parentNode.id;
                // count completed goal
                var completed = countCompletedGoals(ulID);
                // update completed goal
                updateCompletedGoals(ulID, data, completed);
                
            }else{
                return false;
            }
            
        },
        
        removeGoal: function(el, data){
            var element, elToDelete, goalsContainerID, completed;
            
            element = el;
            
            if( element.className === 'fa fa-close' ){ // If clicked on x icon
                
                // get li element
                elToDelete = element.parentNode.parentNode;
                // get ul element id
                goalsContainerID = elToDelete.parentNode.id;
                // delete li element
                elToDelete.parentNode.removeChild(elToDelete);
                // Check if ul has li elements
                checkForItems(goalsContainerID);
                // Update number of goals 
                updateNumOfGoals(goalsContainerID, data);
                // Update completed goals in a list
                completed = countCompletedGoals(goalsContainerID);
                updateCompletedGoals(goalsContainerID, data, completed);
                
            }else if( element.className === 'remove' ){ // If clicked on a tag which is parent of x icon
                
                // get li element
                elToDelete = element.parentNode;
                // get ul element id
                goalsContainerID = elToDelete.parentNode.id;
                // delete li element
                elToDelete.parentNode.removeChild(elToDelete);
                // Check if ul has li elements
                checkForItems(goalsContainerID);
                // Update number of goals 
                updateNumOfGoals(goalsContainerID, data);
                // Update completed goals in a list
                completed = countCompletedGoals(goalsContainerID);
                updateCompletedGoals(goalsContainerID, data, completed);
                
            }else{
                return false;    
            }
            
        },
        
        setDefaultListID: function(){
            document.querySelector(elements.goalID).value = document.querySelector(elements.titleDropdown).value + '-list';
        },
        
    };
    
})();

/////////////////////////////////////////
// Controller
var todoController = (function(todoM, todoV){
    
    var setupEventListeners = function(){
          
        var elements = todoV.getElements();
        
        // Add title to dropdown when submit button clicked
        document.querySelector(elements.titleSubmit).addEventListener('click', addTitleToDropdown);
        
        // Set goal id
        document.querySelector(elements.titleDropdown).addEventListener('change', function(){
            document.querySelector(elements.goalID).value = document.querySelector(elements.titleDropdown).value + '-list';
        });
        
        // Add goal to the list
        document.querySelector(elements.goalSubmit).addEventListener('click', addGoal);
        
        // Remove goal from the list
        document.querySelector(elements.goalsContainer).addEventListener('click', removeGoal);
        
        // Mark goal as completed
        document.querySelector(elements.goalsContainer).addEventListener('click', markAsCompleted);
        
    };
    
    var addTitleToDropdown = function(e){
        
        e.preventDefault();
        
        var title, newTitle, titlesArr;
        
        // 1. Get input data
        title = todoV.getTitle();
        
        // Check if title is not empty
        if( title !== '' ){
            
            // 2. Add title to Model
            newTitle = todoM.addTitle(title.value);

            // 3. Add title to View
            if(newTitle){
                todoV.addTitle(newTitle);
            }

            // 4. Clear field
            todoV.clearTitleField();
            
        }
        
    };
    
    var addGoal = function(e){
        
        e.preventDefault();
        
        var goal, newGoal;
        
        // 1. Get input data
        goal = todoV.getGoal();
        
        // Check if goal input is not empty
        if( goal.value !== '' ){
            
            // 2. Add goal data to Model
            newGoal = todoM.addGoal(goal);
            
            // 3. Add goal data to View
            if(newGoal){
                todoV.addGoal(newGoal, todoM.getTitles(), todoM.getData());
            }
        
            // 4. Clear Goal Field & Set Dropdown to default
            todoV.clearGoalsFields();
            
        }
        
    };
    
    var removeGoal = function(e){
        e.preventDefault();
        
        var el, data, ulID;
        
        // 1. Get the clicked element
        el = e.target;
        
        // 2. Get data from Model
        data = todoM.getData();
        
        // 3. Update number of all goals
        if( el.className === 'fa fa-close' ){
            ulID = el.parentNode.parentNode.parentNode.id;
        }else if( el.className === 'remove' ){
            ulID = el.parentNode.parentNode.id;
        }
        todoM.updateNumOfAllGoals(ulID);
        
        // 4. Delete Goal
        todoV.removeGoal(el, data);
        
    };
    
    var markAsCompleted = function(e){
        e.preventDefault();
        
        var el, data;
        
        // 1. Get the clicked element
        el = e.target;
        
        // 2. Get data from Model
        data = todoM.getData();
        
        // 3. Mark as completed
        todoV.completeGoal(el, data);
        
    };
    
    return {
        init: function(){
            console.log('Application started!');
            todoV.getCurrentYearGoal();
            todoV.setDefaultListID();
            setupEventListeners();
        }
    }
    
})(todoModel, todoView);

todoController.init();















