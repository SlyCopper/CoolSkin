window.onload = function()
{
    let canvasWidth = 900;
    let canvasHeight = 600;
    let ctx;
    let display = 100;
    let blockSize = 30;
    let snakee;
    let apple;
    let withInBlock = canvasWidth/blockSize;
    let heightInBlock = canvasHeight/blockSize;
    let score;
    let timeOut;
    init();

    function init()
    {
        let canvas = document.createElement("canvas"); 
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "70px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        snakee = new Snake([[6,4],[5,4],[4,4]], "right");
        apple = new Apple([10,10]);
        score = 0;
        refrach();
    }
    function refrach()
    {
        snakee.advance();
        if(snakee.checkCollision())
        {
            gameOver();
        }
        else
        {
            if(snakee.isEatingApple(apple))
            {
                score++;
                snakee.ateApple = true;
                do
                {
                    apple.setNewPosition();
        
                }while(apple.isOnSnake(snakee));
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            apple.draw();
            snakee.draw();
            timeOut = setTimeout(refrach, display);
        }
    }
    function gameOver()
    {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        let centreX = canvasWidth/2;
        let centreY = canvasHeight/2;
        ctx.strokeText("Game Over", centreX, centreY - 180);   
        ctx.fillText("Game Over",centreX, centreY - 180);//affiche game over dans le canvas
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche espace pour rejouer",centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche espace pour rejouer",centreX, centreY - 120);
        ctx.restore();
    }

    function restart()
    {
        snakee = new Snake([[6,4],[5,4],[4,4]], "right");
        apple = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refrach();
    }

    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let centreX = canvasWidth/2;
        let centreY = canvasHeight/2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }
    function drawBlock(ctx, position)
    {
        x = position[0] * blockSize;
        y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    function Snake(body, direction)
    {
        this.body = body;
        this.ateApple = false;
        this.direction = direction
        this.draw = function ()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(let i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            let nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0] -=1;
                    break;
                case "right":
                    nextPosition[0] +=1;
                    break;
                case "down":
                    nextPosition[1] +=1;
                    break;
                case "up":
                    nextPosition[1] -=1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
        //Direction autoiriser
        this.setDirection = function(newDirection)
        {
            let allowDirection;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowDirection = ["up","down"];
                    break;
                case "down":
                case "up":
                    allowDirection = ["left","right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowDirection.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }

        };
        this.checkCollision = function()
        {
            let wallCollision = false;
            let sankeColision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let sankeX = head[0];
            let sankeY = head[1];
            let minX = 0;
            let minY = 0;
            maxX = withInBlock - 1;
            maxY = heightInBlock - 1;
            let isNotBetweenHorizontalWalls = sankeX < minX || sankeX > maxX;
            let isNotBetweenVerticalWalls = sankeY < minY || sankeY > maxY;
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollision = true;
            }
            for (let i = 0; i < rest.length; i++)
            {
                if(sankeX === rest[i][0] && sankeY === rest[i][1])
                {
                    sankeColision = true;
                }

            }
            return wallCollision || sankeColision;
        };
        this.isEatingApple = function(appleToEat)
        {
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        };
    }
    //creation de notre boule
    function Apple(position)
    {
        this.position = position;
        this.draw = function ()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            let radius = blockSize/2;
            let x = this.position[0] * blockSize + radius;
            let y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true); //pour tacer un cercle 
            ctx.fill(); //pour remplire notre boule
            ctx.restore();
        };
        this.setNewPosition = function()
        {
            let newX = Math.round((Math.random() * (withInBlock - 1)));
            let newY = Math.round((Math.random() * (heightInBlock - 1)));
            this.position = [newX, newY];         
        };
        this.isOnSnake = function(sanekTocheck)
        {
            let isOnsnake = false;
            for (let i = 0; i < sanekTocheck.body.length; i++)
            {
                if(this.position[0] === sanekTocheck.body[i][0] && this.position[1] === sanekTocheck.body[i][1])
                {
                    isOnsnake = true;
                }
            }
            return isOnsnake;
        };
    }
    //gestion des evenement sur une touche du clavier
    document.onkeydown = function handKeyDown(e)
    {
        let key = e.keyCode;
        let newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }; 
}