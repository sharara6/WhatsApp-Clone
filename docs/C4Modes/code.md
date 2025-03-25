    workspace "Name" "Software Architecture"

    !identifiers hierarchical

    model {
        user = person "User"
        
        authSystem = softwareSystem "Auth System" {
            auth = container Auth Service"
        }
        
        emailService = softwareSystem "Email System" {
            email = container "Email Service"
        }

    
        ss = softwareSystem "Whastapp" {
            Web_App = container "Web Application"
            
            API_Gateway = container "API Gateway" {
                request_router = component "Request Router"
                auth_handler = component "Authentication Handler"
                rate_limiter = component "Rate Limiter"
            }
            
            Chat_Service = container "Chat_Service" {
                Web_Socket = component "Web Socket"
                storage_manager = component "Storage Manager"
            }
            
            Notification_Service = container "Notification_Service" {
                # notification_processor = component "Notification Processor" "Processes notification requests"
                # storage_manager = component "Storage Manager" "Manages notification data storage"
            }
            
            load_balancer = container "Load Balancer"
            Cache = container "Cache"
            chat_db = container "Chat Database" {
                tags "Database"
            }
            notification_db = container "Notification Database" {
                tags "Database"
            }
            db = container "Database" {
                tags "Database"
            }
        }

        user -> ss.Web_App "Uses"
        
        authSystem -> ss.Web_App "Redirect to whatsapp"
        
    
        
        authSystem.auth -> ss.db "Check from"
        
        
        ss.Web_App -> ss.Cache "Retrive from"
        
        ss.Web_App -> ss.API_Gateway.rate_limiter "check request rate"
        
        ss.API_Gateway.rate_limiter -> ss.API_Gateway.auth_handler "go to authentication"
        
        
        ss.API_Gateway.auth_handler -> ss.API_Gateway.request_router "go to routing"
        
        ss.API_Gateway.request_router -> ss.load_balancer "request go to"
        
        ss.load_balancer -> ss.Chat_Service.Web_Socket "delegate request to"
        
        ss.load_balancer -> ss.Notification_Service "delegate request to"
        
        # ss.Notification_Service.notification_processor -> emailService.email "sending notifications"
        # emailService.email -> ss.Notification_Service.storage_manager "manage notifications"
        ss.Notification_Service -> ss.notification_db "Reads from and writes to"
        
       
        
        
        ss.API_Gateway.auth_handler -> authSystem.auth "Authorize user"

        ss.Chat_Service.storage_manager -> ss.chat_db "Reads from and writes to"
        ss.Chat_Service.Web_Socket -> ss.Chat_Service.storage_manager "manage storage"

    }

    views {
        systemContext ss "C1" {
            include *
            autolayout lr
        }

        container ss "C2" {
            include *
            autolayout lr
        }
        
        component ss.API_Gateway "C3" {
            include *
            include user
            include authSystem.auth
            include ss.Web_App
            include ss.Notification_Service
            include ss.Chat_Service.Web_Socket
            include ss.Chat_Service.storage_manager
            # include ss.Notification_Service.notification_processor
            # include ss.Notification_Service.storage_manager
            include ss.load_balancer
            include ss.Cache
            include ss.chat_db
            include ss.notification_db
            include ss.db
            include emailService.email
            autolayout lr
        }

        styles {
            element "Element" {
                color white
            }
            element "Person" {
                background #116611
                shape person
            }
            element "Software System" {
                background #2D882D
            }
            element "Container" {
                background #55aa55
            }
            element "Database" {
                shape cylinder
            }
            element "component" {
                background #55aa55
            }
        }
    }
