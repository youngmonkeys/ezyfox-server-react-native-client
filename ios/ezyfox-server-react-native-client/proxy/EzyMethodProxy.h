//
//  EzyMethodProxy.h
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/26/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface EzyMethodProxy : NSObject
-(void)validate: (NSDictionary*) params;
-(NSObject*)invoke: (NSDictionary*) params;
-(NSString*)getName;
@end

@interface EzyCreateClientMethod : EzyMethodProxy
@property(strong, nonatomic) NSNotification* mNotification;
-(instancetype)initWithComponents: (NSNotification*)notification;
@end

NS_ASSUME_NONNULL_END
